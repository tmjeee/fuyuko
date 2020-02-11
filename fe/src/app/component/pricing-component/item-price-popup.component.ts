import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {PricingStructureItem, PricingStructureItemWithPrice, TablePricingStructureItemWithPrice} from '../../model/pricing-structure.model';
import {Observable} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
    templateUrl: './item-price-popup.component.html',
    styleUrls: ['./item-price-popup.component.scss']
})
export class ItemPricePopupComponent {

    formGroup: FormGroup;
    formControlPrice: FormControl;

    constructor(private matDialogRef: MatDialogRef<ItemPricePopupComponent>,
                @Inject(MAT_DIALOG_DATA) private data: TablePricingStructureItemWithPrice,
                private formBuilder: FormBuilder) {
        this.formControlPrice = this.formBuilder.control(data.price ? data.price : '', [Validators.required]);
        this.formGroup = this.formBuilder.group({
            price: this.formControlPrice
        });
    }

    onSubmit() {
        this.data.price = this.formControlPrice.value;
        this.matDialogRef.close(this.data);
    }

    onCancel($event: MouseEvent) {
        this.matDialogRef.close(null);
    }
}
