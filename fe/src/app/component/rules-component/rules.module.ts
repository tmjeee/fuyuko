import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {RuleEditorDialogComponent} from './rule-editor-dialog.component';
import {RulesTableComponent} from './rules-table.component';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {RuleEditorComponent} from "./rule-editor.component";


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialsModule,
    DataEditorModule,
  ],
  declarations: [
    RuleEditorDialogComponent,
    RulesTableComponent,
    RuleEditorComponent,
  ],
  exports: [
    RuleEditorDialogComponent,
    RulesTableComponent,
    RuleEditorComponent,
  ],
  entryComponents: [
    RuleEditorDialogComponent,
  ]
})
export class RulesModule {

}
