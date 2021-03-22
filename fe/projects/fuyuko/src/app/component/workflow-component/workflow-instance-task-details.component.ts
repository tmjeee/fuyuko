import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WorkflowInstanceTask} from '@fuyuko-common/model/workflow.model';


export interface WorkflowInstanceTaskDetailComponentEvent {
    type: 'WorkflowAction';
    worfklowAction: string;
    workflowInstanceTask: WorkflowInstanceTask;
}


@Component({
    selector: 'app-workflow-instance-task-details',
    templateUrl: './workflow-instance-task-details.component.html',
    styleUrls: ['./workflow-instance-task-details.component.scss']
})
export class WorkflowInstanceTaskDetailsComponent {

    @Input() workflowInstanceTask: WorkflowInstanceTask;
    @Output() events: EventEmitter<WorkflowInstanceTaskDetailComponentEvent> = new EventEmitter();


    doWorkflowAction(action: string) {
        const r: WorkflowInstanceTaskDetailComponentEvent = {
            type: 'WorkflowAction',
            worfklowAction: action,
            workflowInstanceTask: this.workflowInstanceTask,
        };
        this.events.emit(r);
    }
}
