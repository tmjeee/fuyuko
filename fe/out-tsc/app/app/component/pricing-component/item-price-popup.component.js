import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
let ItemPricePopupComponent = class ItemPricePopupComponent {
    constructor(matDialogRef, data, formBuilder) {
        this.matDialogRef = matDialogRef;
        this.data = data;
        this.formBuilder = formBuilder;
        this.formControlPrice = this.formBuilder.control(data.price ? data.price : '', [Validators.required]);
        this.formGroup = this.formBuilder.group({
            price: this.formControlPrice
        });
    }
    onSubmit() {
        this.data.price = this.formControlPrice.value;
        this.matDialogRef.close(this.data);
    }
    onCancel($event) {
        this.matDialogRef.close(null);
    }
};
ItemPricePopupComponent = tslib_1.__decorate([
    Component({
        templateUrl: './item-price-popup.component.html',
        styleUrls: ['./item-price-popup.component.scss']
    }),
    tslib_1.__param(1, Inject(MAT_DIALOG_DATA)),
    tslib_1.__metadata("design:paramtypes", [MatDialogRef, Object, FormBuilder])
], ItemPricePopupComponent);
export { ItemPricePopupComponent };
//# sourceMappingURL=item-price-popup.component.js.map