import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { RuleEditorDialogComponent } from './rule-editor-dialog.component';
import { RulesTableComponent } from './rules-table.component';
import { DataEditorModule } from '../data-editor-component/data-editor.module';
let RulesModule = class RulesModule {
};
RulesModule = tslib_1.__decorate([
    NgModule({
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
            RulesTableComponent
        ],
        exports: [
            RuleEditorDialogComponent,
            RulesTableComponent
        ],
        entryComponents: [
            RuleEditorDialogComponent,
        ]
    })
], RulesModule);
export { RulesModule };
//# sourceMappingURL=rules.module.js.map