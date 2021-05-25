import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {WorkflowInstanceTask} from '@fuyuko-common/model/workflow.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject, Observable} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {NgChanges} from '../../utils/types.util';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {Pagination} from '../../utils/pagination.utils';
import {tap} from 'rxjs/operators';
import {PaginationComponentEvent} from '../pagination-component/pagination.component';

export class InternalDataSource implements DataSource<WorkflowInstanceTask> {

    private subject = new BehaviorSubject([]);

    connect(collectionViewer: CollectionViewer): Observable<WorkflowInstanceTask[] | ReadonlyArray<WorkflowInstanceTask>> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(workflowInstanceTasks: WorkflowInstanceTask[]) {
        this.subject.next(workflowInstanceTasks);
    }
}

export interface WorkflowInstanceTaskTableComponentEvent {
   type: 'actionOnTask';
   workflowInstanceTask: WorkflowInstanceTask;
}

export type WorkflowInstanceTasksFn = (limitOffset: LimitOffset) => Observable<WorkflowInstanceTask[]>;

@Component({
   selector: 'app-workflow-instance-task-table',
   templateUrl: './workflow-instance-task-table.component.html',
   styleUrls: ['./workflow-instance-task-table.component.scss'],
   animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
   ],
})
export class WorkflowInstanceTaskTableComponent implements OnInit {

   @Input() workflowInstanceTasksFn: WorkflowInstanceTasksFn;
   @Input() allowViewButton: boolean;
   @Output() events: EventEmitter<WorkflowInstanceTaskTableComponentEvent>;

   pagination: Pagination;

   columnsToDisplay: string[] = ['name', 'workflowInstanceName', 'taskTitle', 'workflowState',
       'approverUsername', 'approvalStage', 'creationDate'];
   rowExpandMap = new Map<number /* workflowInstanceTask id */, boolean /* is expanded */>();
   dataSource: InternalDataSource;


   constructor() {
       this.dataSource = new InternalDataSource();
       this.allowViewButton = false;
       this.pagination = new Pagination();
       this.events = new EventEmitter();
   }


   expandWorkflowInstanceTaskRow(workflowInstanceTask: WorkflowInstanceTask) {
      const r = !!!this.rowExpandMap.get(workflowInstanceTask.id);
      this.rowExpandMap.set(workflowInstanceTask.id, r);
      return r;
   }

   isWorkflowInstanceTaskRowExpanded(workflowInstanceTask: WorkflowInstanceTask): boolean {
       const r = !!this.rowExpandMap.get(workflowInstanceTask.id);
       this.rowExpandMap.set(workflowInstanceTask.id, r);
       return r;
   }

   ngOnInit(): void {
       if (this.allowViewButton) {
           this.columnsToDisplay.push('action');
       }
       this.reload();
   }

   reload() {
       this.workflowInstanceTasksFn(this.pagination.limitOffset()).pipe(
           tap(w  => this.dataSource.update(w))
       ).subscribe();
   }


   actionOnWorkflowInstanceTask(event: Event, workflowInstanceTask: WorkflowInstanceTask) {
       event.stopPropagation();
       event.preventDefault();
       const r: WorkflowInstanceTaskTableComponentEvent = {
           type: 'actionOnTask',
           workflowInstanceTask
       };
       this.events.emit(r);
   }

   onPaginationEvent($event: PaginationComponentEvent) {
       this.pagination.updateFromPageEvent($event.pageEvent);
       this.reload();
   }
}
