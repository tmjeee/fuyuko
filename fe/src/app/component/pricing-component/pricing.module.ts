import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {PricingStructurePopupComponent} from './pricing-structure-popup.component';
import {ItemPricePopupComponent} from './item-price-popup.component';
import {PricingStructureTableComponent} from './pricing-structure-table.component';
import {ViewOnlyPriceTableComponent} from './view-only-price-table.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ViewOnlyPriceDataItemsTableComponent} from "./view-only-price-data-items-table.component";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
    ],
    declarations: [
        PricingStructurePopupComponent,
        PricingStructureTableComponent,
        ItemPricePopupComponent,
        ViewOnlyPriceTableComponent,
        ViewOnlyPriceDataItemsTableComponent,
    ],
    exports: [
        PricingStructurePopupComponent,
        PricingStructureTableComponent,
        ItemPricePopupComponent,
        BrowserAnimationsModule,
        ViewOnlyPriceTableComponent,
        ViewOnlyPriceDataItemsTableComponent,
    ],
    entryComponents: [
        PricingStructurePopupComponent,
        ItemPricePopupComponent,
    ]
})
export class PricingModule {

}
