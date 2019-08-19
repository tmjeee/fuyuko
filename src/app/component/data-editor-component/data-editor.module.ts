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

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialsModule,
  ],
  declarations: [
    DataEditorComponent,
    DataEditorDialogComponent,
    ItemAttributeValueAsStringPipe,
    ItemEditorComponent,
    ItemEditorDialogComponent,
    DataEditorNoPopupComponent,
    AttributeOperatorEditorComponent,
  ],
  exports: [
    DataEditorComponent,
    DataEditorDialogComponent,
    ItemAttributeValueAsStringPipe,
    ItemEditorComponent,
    ItemEditorDialogComponent,
    DataEditorNoPopupComponent,
    AttributeOperatorEditorComponent,
  ],
  entryComponents: [
    DataEditorDialogComponent,
    ItemEditorDialogComponent,
  ]
})
export class DataEditorModule {
}
