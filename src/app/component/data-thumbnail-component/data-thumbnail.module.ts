import {NgModule} from '@angular/core';
import {DataThumbnailComponent} from './data-thumbnail.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {ItemSearchModule} from '../item-search-component/item-search.module';
import {CarouselComponent} from '../carousel-component/carousel.component';
import {ItemDataEditorDialogComponent} from './item-data-editor-dialog.component';
import {CarouselModule} from '../carousel-component/carousel.module';


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
  ],
  declarations: [
    DataThumbnailComponent,
    ItemDataEditorDialogComponent,
  ],
  exports: [
    DataThumbnailComponent,
    ItemDataEditorDialogComponent,
  ],
  entryComponents: [
    ItemDataEditorDialogComponent
  ]
})
export class DataThumbnailModule {
}
