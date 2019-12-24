import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { ItemSearchComponent } from './item-search.component';
let ItemSearchModule = class ItemSearchModule {
};
ItemSearchModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            AppMaterialsModule,
        ],
        declarations: [
            ItemSearchComponent
        ],
        exports: [
            ItemSearchComponent
        ]
    })
], ItemSearchModule);
export { ItemSearchModule };
//# sourceMappingURL=item-search.module.js.map