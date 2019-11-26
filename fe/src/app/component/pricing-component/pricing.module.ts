import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {PricingStructurePopupComponent} from './pricing-structure-popup.component';
import {ItemPricePopupComponent} from './item-price-popup.component';
import {PricingStructureTableComponent} from './pricing-structure-table.component';


@NgModule({
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
    ],
    exports: [
        PricingStructurePopupComponent,
        PricingStructureTableComponent,
        ItemPricePopupComponent,
        BrowserAnimationsModule,
    ],
    entryComponents: [
        PricingStructurePopupComponent,
        ItemPricePopupComponent,
    ]
})
export class PricingModule {

}
