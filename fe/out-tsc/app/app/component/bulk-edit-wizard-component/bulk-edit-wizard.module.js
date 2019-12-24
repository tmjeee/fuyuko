import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { BulkEditWizardComponent } from './bulk-edit-wizard.component';
import { DataEditorModule } from '../data-editor-component/data-editor.module';
import { BulkEditReviewTableComponent } from './bulk-edit-review-table.component';
import { JobsModule } from '../jobs-component/jobs.module';
let BulkEditWizardModule = class BulkEditWizardModule {
};
BulkEditWizardModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            AppMaterialsModule,
            DataEditorModule,
            JobsModule,
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
], BulkEditWizardModule);
export { BulkEditWizardModule };
//# sourceMappingURL=bulk-edit-wizard.module.js.map