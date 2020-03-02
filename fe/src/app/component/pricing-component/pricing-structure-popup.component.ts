import {Component, Inject} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PricingStructure, PricingStructureWithItems} from '../../model/pricing-structure.model';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {View} from '../../model/view.model';


@Component({
    templateUrl: './pricing-structure-popup.component.html',
    styleUrls: ['./pricing-structure-popup.component.scss']
})
export class PricingStructurePopupComponent {

    formGroup: FormGroup;
    formControlView: FormControl;
    formControlName: FormControl;
    formControlDescription: FormControl;

    constructor(private matDialogRef: MatDialogRef<PricingStructurePopupComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {views: View[], pricingStructure: PricingStructure},
                private formBuilder: FormBuilder) {
        this.formControlView =
            this.formBuilder.control(data && data.views && data.pricingStructure ?
                data.views.find((v: View) => v.id === data.pricingStructure.viewId) : '');
        this.formControlName =
            this.formBuilder.control(data && data.pricingStructure ?
                data.pricingStructure.name : '', [Validators.required]);
        this.formControlDescription =
            this.formBuilder.control(data && data.pricingStructure ?
                data.pricingStructure.description : '', [Validators.required]);
        this.formGroup = this.formBuilder.group({
            view: this.formControlView,
            name: this.formControlName,
            description: this.formControlDescription
        });
    }

    onSubmit() {
        this.matDialogRef.close({
            id: (this.data.pricingStructure ? this.data.pricingStructure.id : -1),
            name: this.formControlName.value,
            viewId: this.formControlView.value.id,
            description: this.formControlDescription.value
        } as PricingStructure);
    }

    onCancel($event: MouseEvent) {
        this.matDialogRef.close(null);
    }
}
