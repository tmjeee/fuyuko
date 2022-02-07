import {NgModule} from '@angular/core';
import {AttributeTableComponent} from './attribute-table.component';
import {SingleSelectComponent} from './single-select.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {DoubleSelectComponent} from './double-select.component';
import {ViewOnlyAttributeTableComponent} from './view-only-attribute-table.component';
import {EditAttributeComponent} from "./edit-attribute.component";
import {SharedComponentUtilsModule} from "../shared-component-utils/shared-component-utils.module";

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        SharedComponentUtilsModule,
    ],
    declarations: [
        AttributeTableComponent,
        SingleSelectComponent,
        DoubleSelectComponent,
        ViewOnlyAttributeTableComponent,
        EditAttributeComponent,
    ],
    exports: [
        AttributeTableComponent,
        SingleSelectComponent,
        DoubleSelectComponent,
        ViewOnlyAttributeTableComponent,
        EditAttributeComponent,
    ]
})
export class AttributeTableModule {

}
