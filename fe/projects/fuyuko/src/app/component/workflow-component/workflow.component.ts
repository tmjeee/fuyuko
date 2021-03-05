import {Component, Input} from '@angular/core';
import {View} from '../../model/view.model';
import {MatSelectChange} from '@angular/material/select';
import {MatDialog} from '@angular/material/dialog';
import {WorkflowEditorDialogComponent, WorkflowEditorDialogComponentResult} from './workflow-editor-dialog.component';
import {tap} from 'rxjs/operators';
import {Workflow, WorkflowDefinition, WorkflowInstanceAction, WorkflowInstanceType} from '../../model/workflow.model';
import {NotificationsService} from 'angular2-notifications';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../model/api-response.model';
import {Attribute} from '../../model/attribute.model';

export type CreateWorkflowFn = (r: WorkflowEditorDialogComponentResult) => void ;
export type GetWorkflowsByViewFn = (view: View) => Observable<Workflow[]>;
export type GetAttributesByViewFn = (view: View) => Observable<Attribute[]>;

@Component({
    selector: 'app-workflow',
    templateUrl: './workflow.component.html',
    styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent {

    @Input() views: View[];
    @Input() workflowDefinitions: WorkflowDefinition[];
    selectedView: View;

    @Input() createWorkflowFn: CreateWorkflowFn;
    @Input() getWorkflowsByViewFn: GetWorkflowsByViewFn;
    @Input() getAttributesByViewFn: GetAttributesByViewFn;
    currentViewWorkflows: Workflow[];

    constructor(private matDialog: MatDialog) { }


    onViewChanged($event: MatSelectChange) {
        this.selectedView = $event.value;
        this.reload();
    }

    createWorkflow() {
        this.matDialog.open(WorkflowEditorDialogComponent, {
            width: '90vw',
            height: '90vh',
            data: {
                views: this.views,
                getAttributesByViewFn: this.getAttributesByViewFn,
                workflowDefinitions: this.workflowDefinitions
            }
        })
            .afterClosed()
            .pipe(
                tap((r: WorkflowEditorDialogComponentResult) => {
                    if (r) {
                        this.createWorkflowFn(r);
                    }
                })
            ).subscribe();

    }

    reload() {
        if (this.selectedView) {
            this.getWorkflowsByViewFn(this.selectedView)
                .pipe(
                    tap(workflows => {
                        this.currentViewWorkflows = workflows;
                    })
                ).subscribe();
        }
    }
}
