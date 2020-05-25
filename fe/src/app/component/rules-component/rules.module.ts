import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {RulesTableComponent} from './rules-table.component';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {RuleEditorComponent} from './rule-editor.component';
import {CustomRuleTableComponent} from "./custom-rule-table.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {SharedComponentUtilsModule} from "../shared-component-utils/shared-component-utils.module";


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialsModule,
    DataEditorModule,
    FlexLayoutModule,
    SharedComponentUtilsModule,
  ],
  declarations: [
    RulesTableComponent,
    RuleEditorComponent,
    CustomRuleTableComponent,
  ],
  exports: [
    RulesTableComponent,
    RuleEditorComponent,
    CustomRuleTableComponent,
  ],
  entryComponents: [
  ]
})
export class RulesModule {

}
