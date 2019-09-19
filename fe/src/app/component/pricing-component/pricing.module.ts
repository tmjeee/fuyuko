import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {PricingStructurePopupComponent} from './pricing-structure-popup.component';
import {ItemPriceTableComponent} from './item-price-table.component';
import {ItemPricePopupComponent} from './item-price-popup.component';
import {PricingStructureMainComponent} from './pricing-structure-main.component';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule
    ],
    declarations: [
        PricingStructurePopupComponent,
        ItemPriceTableComponent,
        ItemPricePopupComponent,
        PricingStructureMainComponent,
    ],
    exports: [
        PricingStructurePopupComponent,
        ItemPriceTableComponent,
        ItemPricePopupComponent,
        PricingStructureMainComponent,
    ],
    entryComponents: [
        PricingStructurePopupComponent,
        ItemPricePopupComponent,
    ]
})
export class PricingModule {

}
