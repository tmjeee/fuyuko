import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { EditAttributeDialogComponent } from './edit-attribute-dialog.component';
import { AttributeTableComponent } from './attribute-table.component';
import { SingleSelectComponent } from './single-select.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { DoubleSelectComponent } from './double-select.component';
import { ViewOnlyAttributeTableComponent } from './view-only-attribute-table.component';
let AttributeTableModule = class AttributeTableModule {
};
AttributeTableModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            AppMaterialsModule,
        ],
        declarations: [
            AttributeTableComponent,
            EditAttributeDialogComponent,
            SingleSelectComponent,
            DoubleSelectComponent,
            ViewOnlyAttributeTableComponent,
        ],
        exports: [
            AttributeTableComponent,
            EditAttributeDialogComponent,
            SingleSelectComponent,
            DoubleSelectComponent,
            ViewOnlyAttributeTableComponent,
        ],
        entryComponents: [
            EditAttributeDialogComponent
        ]
    })
], AttributeTableModule);
export { AttributeTableModule };
//# sourceMappingURL=attribute-table.module.js.map