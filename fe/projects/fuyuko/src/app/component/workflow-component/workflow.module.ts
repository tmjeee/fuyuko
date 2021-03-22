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
import {WorkflowInstanceTaskDetailsComponent} from './workflow-instance-task-details.component';
import {WorkflowInstanceTaskTableComponent} from './workflow-instance-task-table.component';
import {PaginationModule} from '../pagination-component/pagination.module';
import {WorkflowInstanceCommentsComponent} from './workflow-instance-comments.component';
import {AvatarModule} from '../avatar-component/avatar.module';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        SharedComponentUtilsModule,
        FlexModule,
        PaginationModule,
        AvatarModule,
    ],
    declarations: [
        WorkflowDefinitionTableComponent,
        WorkflowTableComponent,
        WorkflowEditorDialogComponent,
        WorkflowComponent,
        WorkflowInstanceTaskDetailsComponent,
        WorkflowInstanceTaskTableComponent,
        WorkflowInstanceCommentsComponent,
    ],
    exports: [
        WorkflowDefinitionTableComponent,
        WorkflowTableComponent,
        WorkflowEditorDialogComponent,
        WorkflowComponent,
        WorkflowInstanceTaskDetailsComponent,
        WorkflowInstanceTaskTableComponent,
        WorkflowInstanceCommentsComponent,
    ],
    entryComponents: [
        WorkflowEditorDialogComponent,
    ]
})
export class WorkflowModule {

}
