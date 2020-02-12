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
    ],
    declarations: [
        ExportDataComponent
    ],
    exports: [
        ExportDataComponent
    ]
})
export class ExportDataModule {

}
