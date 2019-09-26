import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
    templateUrl: './pricing-structure-popup.component.html',
    styleUrls: ['./pricing-structure-popup.component.scss']
})
export class PricingStructurePopupComponent {

    formGroup: FormGroup;
    formControlName: FormControl;
    formControlDescription: FormControl;

    constructor(private matDialogRef: MatDialogRef<PricingStructurePopupComponent>,
                private formBuilder: FormBuilder) {
        this.formControlName = this.formBuilder.control('', [Validators.required]);
        this.formControlDescription = this.formBuilder.control('', [Validators.required]);
        this.formGroup = this.formBuilder.group({
            name: this.formControlName,
            description: this.formControlDescription
        });
    }

    onSubmit() {
    }

    onCancel($event: MouseEvent) {
        this.matDialogRef.close(null);
    }
}
