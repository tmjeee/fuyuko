import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {SharedComponentUtilsModule} from '../shared-component-utils/shared-component-utils.module';
import {WorkflowDefinitionTableComponent} from './workflow-definition-table.component';
import {WorkflowTableComponent} from './workflow-table.component';
import {WorkflowEditorDialogComponent} from './workflow-editor-dialog.component';
import {WorkflowComponent} from './workflow.component';
import {FlexModule} from '@angular/flex-layout';
import {WorkflowInstanceTasksComponent} from './workflow-instance-tasks.component';
import {WorkflowInstanceTaskTableComponent} from './workflow-instance-task-table.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        SharedComponentUtilsModule,
        FlexModule,
    ],
    declarations: [
        WorkflowDefinitionTableComponent,
        WorkflowTableComponent,
        WorkflowEditorDialogComponent,
        WorkflowComponent,
        WorkflowInstanceTasksComponent,
        WorkflowInstanceTaskTableComponent,
    ],
    exports: [
        WorkflowDefinitionTableComponent,
        WorkflowTableComponent,
        WorkflowEditorDialogComponent,
        WorkflowComponent,
        WorkflowInstanceTasksComponent,
        WorkflowInstanceTaskTableComponent,
    ],
    entryComponents: [
        WorkflowEditorDialogComponent,
    ]
})
export class WorkflowModule {

}
