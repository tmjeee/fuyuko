import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {DataEditorComponent} from './data-editor.component';
import {DataEditorDialogComponent} from './data-editor-dialog.component';
import {ItemAttributeValueAsStringPipe} from './item-attribute-value-as-string.pipe';
import {ItemEditorComponent} from './item-editor.component';
import {ItemEditorDialogComponent} from './item-editor-dialog.component';
import {DataEditorNoPopupComponent} from './data-editor-no-popup.component';
import {AttributeOperatorEditorComponent} from './attribute-operator-editor.component';
import {MultiValueAttributeOperatorEditorComponent} from "./multi-value-attribute-operator-editor.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ItemInfoComponent} from "./item-info.component";
import {CarouselModule} from "../carousel-component/carousel.module";

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialsModule,
    FlexLayoutModule,
    CarouselModule,
  ],
  declarations: [
    DataEditorComponent,
    DataEditorDialogComponent,
    ItemAttributeValueAsStringPipe,
    ItemEditorComponent,
    ItemEditorDialogComponent,
    DataEditorNoPopupComponent,
    AttributeOperatorEditorComponent,
    MultiValueAttributeOperatorEditorComponent,
    ItemInfoComponent,
  ],
  exports: [
    DataEditorComponent,
    DataEditorDialogComponent,
    ItemAttributeValueAsStringPipe,
    ItemEditorComponent,
    ItemEditorDialogComponent,
    DataEditorNoPopupComponent,
    AttributeOperatorEditorComponent,
    MultiValueAttributeOperatorEditorComponent,
    ItemInfoComponent,
  ],
  entryComponents: [
    DataEditorDialogComponent,
    ItemEditorDialogComponent,
  ]
})
export class DataEditorModule {
}
