import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {TablePricingStructureItemWithPrice} from '../../model/pricing-structure.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COUNTRY_CURRENCY_UNITS, CountryCurrencyUnits} from "../../model/unit.model";


@Component({
    templateUrl: './item-price-popup.component.html',
    styleUrls: ['./item-price-popup.component.scss']
})
export class ItemPricePopupComponent {

    formGroup: FormGroup;
    formControlPrice: FormControl;
    formControlPriceUnit: FormControl;
    units: CountryCurrencyUnits[];

    constructor(private matDialogRef: MatDialogRef<ItemPricePopupComponent>,
                @Inject(MAT_DIALOG_DATA) private data: TablePricingStructureItemWithPrice,
                private formBuilder: FormBuilder) {
        this.formControlPrice = this.formBuilder.control(data.price ? data.price : '', [Validators.required]);
        this.formControlPriceUnit = this.formBuilder.control(data.country ? data.country : '', [Validators.required]);
        this.formGroup = this.formBuilder.group({
            price: this.formControlPrice,
            priceUnit: this.formControlPriceUnit
        });
        this.units = COUNTRY_CURRENCY_UNITS;
    }

    onSubmit() {
        this.data.price = this.formControlPrice.value;
        this.data.country = this.formControlPriceUnit.value;
        this.matDialogRef.close(this.data);
    }

    onCancel($event: MouseEvent) {
        this.matDialogRef.close(null);
    }
}
