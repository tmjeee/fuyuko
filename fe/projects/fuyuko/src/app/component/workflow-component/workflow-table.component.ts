import {Component, Input, OnChanges} from '@angular/core';
import {Workflow} from '@fuyuko-common/model/workflow.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {NgChanges} from '../../utils/types.util';

export class InternalDataSource extends DataSource<Workflow> {

   private subject = new BehaviorSubject([]);
   hasData = false;

   connect(collectionViewer: CollectionViewer): Observable<Workflow[] | ReadonlyArray<Workflow>> {
      return this.subject.asObservable();
   }

   disconnect(collectionViewer: CollectionViewer): void {
       this.subject.complete();
   }

   refresh(workflows: Workflow[]) {
       this.hasData = (workflows && workflows.length > 0);
       this.subject.next(workflows);
   }

}


@Component({
   selector: 'app-workflow-table',
   templateUrl: './workflow-table.component.html',
   styleUrls: ['./workflow-table.component.scss'],
   animations: [
      trigger('detailExpand', [
         state('collapsed', style({height: '0px', minHeight: '0'})),
         state('expanded', style({height: '*'})),
         transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
   ],
})
export class WorkflowTableComponent implements OnChanges {

   columnsToDisplay: string[] = ['workflowDefinition', 'workflowName', 'workflowAction' , 'workflowType'];
   dataSource = new InternalDataSource();

   @Input() workflows: Workflow[];

   private rowExpandedMap = new Map<string, boolean>();

   isRowExpanded(workflow: Workflow): boolean {
      const r = !!this.rowExpandedMap.get(String(workflow.id));
      this.rowExpandedMap.set(String(workflow.id), r);
      return r;
   }

   expandRow(workflow: Workflow) {
      const r = !!!this.rowExpandedMap.get(String(workflow.id));
      this.rowExpandedMap.set(String(workflow.id), r);
      return false;
   }

   ngOnChanges(changes: NgChanges<WorkflowTableComponent>): void {
       if (changes.workflows && changes.workflows.currentValue) {
          this.dataSource.refresh(changes.workflows.currentValue);
       }
   }
}
