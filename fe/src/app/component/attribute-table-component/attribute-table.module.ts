import {NgModule} from '@angular/core';
import {EditAttributeDialogComponent} from './edit-attribute-dialog.component';
import {AttributeTableComponent} from './attribute-table.component';
import {SingleSelectComponent} from './single-select.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {DoubleSelectComponent} from './double-select.component';
import {ViewOnlyAttributeTableComponent} from './view-only-attribute-table.component';
import {EditAttributeComponent} from "./edit-attribute.component";

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialsModule,
  ],
  declarations: [
    AttributeTableComponent,
    EditAttributeDialogComponent,
    SingleSelectComponent,
    DoubleSelectComponent,
    ViewOnlyAttributeTableComponent,
    EditAttributeComponent,
  ],
  exports: [
    AttributeTableComponent,
    EditAttributeDialogComponent,
    SingleSelectComponent,
    DoubleSelectComponent,
    ViewOnlyAttributeTableComponent,
    EditAttributeComponent,
  ],
  entryComponents: [
    EditAttributeDialogComponent
  ]
})
export class AttributeTableModule {

}
