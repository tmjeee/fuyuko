import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {ExportDataComponent} from './export-data.component';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {DataTableModule} from '../data-table-component/data-table.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AttributeTableModule} from '../attribute-table-component/attribute-table.module';
import {PricingModule} from '../pricing-component/pricing.module';
import {ExportArtifactsComponent} from './export-artifacts.component';
import {CustomExportWizardComponent} from './custom-export-wizard.component';
import {CustomExportListComponent} from './custom-export-list.component';
import {ViewModule} from '../view-component/view.module';
import {CustomExportInputFormComponent} from './custom-export-input-form.component';
import {CustomExportPreviewComponent} from './custom-export-preview.component';
import {CustomExportSubmitJobComponent} from './custom-export-submit-job.component';
import {NotificationModule} from '../notification-component/notification.module';
import {SharedComponentUtilsModule} from '../shared-component-utils/shared-component-utils.module';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        DataTableModule,
        DataEditorModule,
        FlexLayoutModule,
        AttributeTableModule,
        PricingModule,
        ViewModule,
        NotificationModule,
        SharedComponentUtilsModule,
    ],
    declarations: [
        ExportDataComponent,
        ExportArtifactsComponent,
        CustomExportWizardComponent,
        CustomExportListComponent,
        CustomExportInputFormComponent,
        CustomExportPreviewComponent,
        CustomExportSubmitJobComponent,
    ],
    exports: [
        ExportDataComponent,
        ExportArtifactsComponent,
        CustomExportWizardComponent,
        CustomExportListComponent,
        CustomExportInputFormComponent,
        CustomExportPreviewComponent,
        CustomExportSubmitJobComponent,
    ]
})
export class ExportDataModule {

}
