import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {DataTableComponent} from './data-table.component';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {ItemSearchModule} from '../item-search-component/item-search.module';
import {ViewOnlyDataTableComponent} from './view-only-data-table.component';
import {ItemImageDialogComponent} from "./item-image-dialog.component";
import {CarouselModule} from "../carousel-component/carousel.module";
import {SharedComponentUtilsModule} from "../shared-component-utils/shared-component-utils.module";
import {FlexLayoutModule} from "@angular/flex-layout";


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialsModule,
    DataEditorModule,
    ItemSearchModule,
    CarouselModule,
    FlexLayoutModule,
    SharedComponentUtilsModule,
  ],
  declarations: [
    DataTableComponent,
    ViewOnlyDataTableComponent,
    ItemImageDialogComponent,
  ],
  exports: [
    DataTableComponent,
    ViewOnlyDataTableComponent,
    ItemImageDialogComponent,
  ],
  entryComponents: [
    ItemImageDialogComponent,
  ]
})
export class DataTableModule {

}
