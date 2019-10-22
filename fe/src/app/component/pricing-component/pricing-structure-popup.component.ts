import {Component, Inject} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PricingStructure, PricingStructureWithItems} from '../../model/pricing-structure.model';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";


@Component({
    templateUrl: './pricing-structure-popup.component.html',
    styleUrls: ['./pricing-structure-popup.component.scss']
})
export class PricingStructurePopupComponent {

    formGroup: FormGroup;
    formControlName: FormControl;
    formControlDescription: FormControl;

    constructor(private matDialogRef: MatDialogRef<PricingStructurePopupComponent>,
                @Inject(MAT_DIALOG_DATA) private data: PricingStructureWithItems,
                private formBuilder: FormBuilder) {
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
        } as PricingStructure);
    }

    onCancel($event: MouseEvent) {
        this.matDialogRef.close(null);
    }
}
