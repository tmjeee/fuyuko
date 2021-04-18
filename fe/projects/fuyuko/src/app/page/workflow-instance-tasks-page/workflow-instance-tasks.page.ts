import {Component, OnInit} from '@angular/core';
import {WorkflowInstanceTask} from '@fuyuko-common/model/workflow.model';
import {WorkflowService} from '../../service/workflow-service/workflow.service';
import {Pagination} from '../../utils/pagination.utils';
import {AuthService} from '../../service/auth-service/auth.service';
import {map, tap} from 'rxjs/operators';
import {
    WorkflowInstanceTasksFn,
    WorkflowInstanceTaskTableComponentEvent
} from '../../component/workflow-component/workflow-instance-task-table.component';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';


@Component({
    templateUrl: './workflow-instance-tasks.page.html',
    styleUrls: ['./workflow-instance-tasks.page.scss']
})
export class WorkflowInstanceTasksPageComponent implements OnInit {

    pagination: Pagination;
    workflowInstancePendingTasksFn: WorkflowInstanceTasksFn;
    workflowInstanceActionedTasksFn: WorkflowInstanceTasksFn;
    workflowInstanceExpiredTasksFn: WorkflowInstanceTasksFn;

    constructor(private workflowService: WorkflowService,
                private authService: AuthService,
                private router: Router) {
        this.pagination = new Pagination();
        this.workflowInstancePendingTasksFn = this.loadWorkflowInstancePendingTasks.bind(this);
        this.workflowInstanceActionedTasksFn = this.loadWorkflowInstanceActionedTasks.bind(this);
        this.workflowInstanceExpiredTasksFn = this.loadWorkflowInstanceExpiredTasks.bind(this);
    }

    loadWorkflowInstancePendingTasks(limitOffset: LimitOffset): Observable<WorkflowInstanceTask[]> {
        const myself = this.authService.myself();
        return this.workflowService.getWorkflowInstanceTaskForUserByStatus(myself.id, 'PENDING')
            .pipe(
                map(r => r.payload),
            );
    }

    loadWorkflowInstanceActionedTasks(limitOffset: LimitOffset): Observable<WorkflowInstanceTask[]> {
        const myself = this.authService.myself();
        return this.workflowService.getWorkflowInstanceTaskForUserByStatus(myself.id, 'ACTIONED')
            .pipe(
                map(r => r.payload),
            );
    }

    loadWorkflowInstanceExpiredTasks(limitOffset: LimitOffset): Observable<WorkflowInstanceTask[]> {
        const myself = this.authService.myself();
        return this.workflowService.getWorkflowInstanceTaskForUserByStatus(myself.id, 'EXPIRED')
            .pipe(
                map(r => r.payload),
            );
    }

    ngOnInit(): void {
    }


    onWorkflowInstanceTaskTableEvents($event: WorkflowInstanceTaskTableComponentEvent) {
        this.router.navigate(['/workflow-layout', 'workflow-task-details', $event.workflowInstanceTask.id]);
    }
}
