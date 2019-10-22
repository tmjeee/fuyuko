import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {DataTableComponent} from './data-table.component';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {ItemSearchModule} from '../item-search-component/item-search.module';
import {ViewOnlyDataTableComponent} from './view-only-data-table.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialsModule,
    DataEditorModule,
    ItemSearchModule,
  ],
  declarations: [
    DataTableComponent,
    ViewOnlyDataTableComponent,
  ],
  exports: [
    DataTableComponent,
    ViewOnlyDataTableComponent,
  ]
})
export class DataTableModule {

}
