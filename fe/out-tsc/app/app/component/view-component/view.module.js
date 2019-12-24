import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { ViewTableComponent } from './view-table.component';
import { ViewEditorComponent } from './view-editor.component';
import { ViewEditorDialogComponent } from './view-editor-dialog.component';
import { ViewSelectorComponent } from "./view-selector.component";
let ViewModule = class ViewModule {
};
ViewModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            AppMaterialsModule,
        ],
        declarations: [
            ViewTableComponent,
            ViewEditorComponent,
            ViewEditorDialogComponent,
            ViewSelectorComponent,
        ],
        exports: [
            ViewTableComponent,
            ViewEditorComponent,
            ViewEditorDialogComponent,
            ViewSelectorComponent,
        ],
        entryComponents: [
            ViewEditorDialogComponent,
        ]
    })
], ViewModule);
export { ViewModule };
//# sourceMappingURL=view.module.js.map