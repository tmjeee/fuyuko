import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PricingStructureItem, PricingStructureItemWithPrice} from '../../model/pricing-structure.model';
import {Observable} from 'rxjs';

interface DialogDataType {
    items: Observable<PricingStructureItem>;
    pricingStructureItem: PricingStructureItemWithPrice;
}

@Component({
    templateUrl: './item-price-popup.component.html',
    styleUrls: ['./item-price-popup.component.scss']
})
export class ItemPricePopupComponent {

    constructor(private matDialogRef: MatDialogRef<ItemPricePopupComponent>,
                @Inject(MAT_DIALOG_DATA) private data: DialogDataType) {}

}
