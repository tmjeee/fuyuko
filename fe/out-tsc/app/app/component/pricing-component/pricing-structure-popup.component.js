import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
let PricingStructurePopupComponent = class PricingStructurePopupComponent {
    constructor(matDialogRef, data, formBuilder) {
        this.matDialogRef = matDialogRef;
        this.data = data;
        this.formBuilder = formBuilder;
        this.formControlName = this.formBuilder.control(data ? data.name : '', [Validators.required]);
        this.formControlDescription = this.formBuilder.control(data ? data.description : '', [Validators.required]);
        this.formGroup = this.formBuilder.group({
            name: this.formControlName,
            description: this.formControlDescription
        });
    }
    onSubmit() {
        this.matDialogRef.close({
            id: (this.data ? this.data.id : -1),
            name: this.formControlName.value,
            description: this.formControlDescription.value
        });
    }
    onCancel($event) {
        this.matDialogRef.close(null);
    }
};
PricingStructurePopupComponent = tslib_1.__decorate([
    Component({
        templateUrl: './pricing-structure-popup.component.html',
        styleUrls: ['./pricing-structure-popup.component.scss']
    }),
    tslib_1.__param(1, Inject(MAT_DIALOG_DATA)),
    tslib_1.__metadata("design:paramtypes", [MatDialogRef, Object, FormBuilder])
], PricingStructurePopupComponent);
export { PricingStructurePopupComponent };
//# sourceMappingURL=pricing-structure-popup.component.js.map