import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {BulkEditWizardComponent} from './bulk-edit-wizard.component';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {BulkEditReviewTableComponent} from './bulk-edit-review-table.component';
import {JobsModule} from '../jobs-component/jobs.module';
import {SharedComponentUtilsModule} from "../shared-component-utils/shared-component-utils.module";

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        DataEditorModule,
        JobsModule,
        SharedComponentUtilsModule,
    ],
    declarations: [
        BulkEditWizardComponent,
        BulkEditReviewTableComponent,
    ],
    exports: [
        BulkEditWizardComponent,
        BulkEditReviewTableComponent,
    ]
})
export class BulkEditWizardModule {
}
