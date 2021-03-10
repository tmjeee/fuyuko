import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {BulkEditWizardComponent} from './bulk-edit-wizard.component';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {BulkEditReviewTableComponent} from './bulk-edit-review-table.component';
import {JobsModule} from '../jobs-component/jobs.module';
import {SharedComponentUtilsModule} from '../shared-component-utils/shared-component-utils.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CustomBulkEditWizardComponent} from './custom-bulk-edit-wizard.component';
import {ViewModule} from '../view-component/view.module';
import {CustomBulkEditListComponent} from './custom-bulk-edit-list.component';
import {CustomBulkEditInputFormComponent} from './custom-bulk-edit-input-form.component';
import {CustomBulkEditPreviewComponent} from './custom-bulk-edit-preview.component';
import {NotificationModule} from '../notification-component/notification.module';
import {CustomBulkEditSubmitJobComponent} from './custom-bulk-edit-submit.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        DataEditorModule,
        JobsModule,
        FlexLayoutModule,
        SharedComponentUtilsModule,
        ViewModule,
        NotificationModule,
    ],
    declarations: [
        BulkEditWizardComponent,
        BulkEditReviewTableComponent,
        CustomBulkEditWizardComponent,
        CustomBulkEditListComponent,
        CustomBulkEditInputFormComponent,
        CustomBulkEditPreviewComponent,
        CustomBulkEditSubmitJobComponent,
    ],
    exports: [
        BulkEditWizardComponent,
        BulkEditReviewTableComponent,
        CustomBulkEditWizardComponent,
        CustomBulkEditListComponent,
        CustomBulkEditInputFormComponent,
        CustomBulkEditPreviewComponent,
        CustomBulkEditSubmitJobComponent,
    ]
})
export class BulkEditWizardModule {
}
