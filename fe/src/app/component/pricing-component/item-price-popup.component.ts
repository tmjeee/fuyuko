import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PricingStructureItem, PricingStructureItemWithPrice, TablePricingStructureItemWithPrice} from '../../model/pricing-structure.model';
import {Observable} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

interface DialogDataType {
    pricingStructureItem: TablePricingStructureItemWithPrice;
}

@Component({
    templateUrl: './item-price-popup.component.html',
    styleUrls: ['./item-price-popup.component.scss']
})
export class ItemPricePopupComponent {

    formGroup: FormGroup;
    formControlPrice: FormControl;

    constructor(private matDialogRef: MatDialogRef<ItemPricePopupComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private data: DialogDataType) {
        this.formControlPrice = this.formBuilder.control('', [Validators.required]);
        this.formGroup = this.formBuilder.group({
            price: this.formControlPrice
        });
    }

    onSubmit() {
        this.data.pricingStructureItem.price = this.formControlPrice.value;
        this.matDialogRef.close(this.data.pricingStructureItem);
    }

    onCancel($event: MouseEvent) {
        this.matDialogRef.close(null);
    }
}
