import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {ImportDataComponent} from './import-data.component';
import {DataTableModule} from '../data-table-component/data-table.module';
import {NotificationMessageListingModule} from '../notification-message-listing-component/notification-message-listing.module';
import {AttributeTableModule} from '../attribute-table-component/attribute-table.module';
import {PricingModule} from '../pricing-component/pricing.module';
import {CustomImportWizardComponent} from "./custom-import-wizard.component";
import {CustomImportListComponent} from "./custom-import-list.component";
import {ViewModule} from "../view-component/view.module";
import {CustomImportInputFormComponent} from "./custom-import-input-form.component";
import {CustomImportPreviewComponent} from "./custom-import-preview.component";
import {CustomImportSubmitJobComponent} from "./custom-import-submit-job.component";
import {NotificationModule} from "../notification-component/notification.module";
import {SharedComponentUtilsModule} from "../shared-component-utils/shared-component-utils.module";

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        DataTableModule,
        NotificationMessageListingModule,
        AttributeTableModule,
        PricingModule,
        ViewModule,
        NotificationModule,
        SharedComponentUtilsModule,
    ],
    declarations: [
        ImportDataComponent,
        CustomImportWizardComponent,
        CustomImportListComponent,
        CustomImportInputFormComponent,
        CustomImportPreviewComponent,
        CustomImportSubmitJobComponent,
    ],
    exports: [
        ImportDataComponent,
        CustomImportWizardComponent,
        CustomImportListComponent,
        CustomImportInputFormComponent,
        CustomImportPreviewComponent,
        CustomImportSubmitJobComponent,
    ]
})
export class ImportDataModule {

}
