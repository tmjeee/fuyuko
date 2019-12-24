import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { PricingStructurePopupComponent } from './pricing-structure-popup.component';
import { ItemPricePopupComponent } from './item-price-popup.component';
import { PricingStructureTableComponent } from './pricing-structure-table.component';
import { ViewOnlyPriceTableComponent } from './view-only-price-table.component';
let PricingModule = class PricingModule {
};
PricingModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            AppMaterialsModule,
            BrowserAnimationsModule,
        ],
        declarations: [
            PricingStructurePopupComponent,
            PricingStructureTableComponent,
            ItemPricePopupComponent,
            ViewOnlyPriceTableComponent,
        ],
        exports: [
            PricingStructurePopupComponent,
            PricingStructureTableComponent,
            ItemPricePopupComponent,
            BrowserAnimationsModule,
            ViewOnlyPriceTableComponent,
        ],
        entryComponents: [
            PricingStructurePopupComponent,
            ItemPricePopupComponent,
        ]
    })
], PricingModule);
export { PricingModule };
//# sourceMappingURL=pricing.module.js.map