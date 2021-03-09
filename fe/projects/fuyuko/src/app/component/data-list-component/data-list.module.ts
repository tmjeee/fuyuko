import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {ItemSearchModule} from '../item-search-component/item-search.module';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {DataListComponent} from './data-list.component';
import {CarouselModule} from '../carousel-component/carousel.module';
import {SharedComponentUtilsModule} from '../shared-component-utils/shared-component-utils.module';

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
    SharedComponentUtilsModule
  ],
  declarations: [
    DataListComponent
  ],
  exports: [
    DataListComponent
  ]
})
export class DataListModule {

}
