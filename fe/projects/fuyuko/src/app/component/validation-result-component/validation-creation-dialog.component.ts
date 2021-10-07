import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
    templateUrl: './validation-creation-dialog.component.html',
    styleUrls: ['./validation-creation-dialog.component.scss']
})
export class ValidationCreationDialogComponent {

    formGroup: FormGroup;
    formControlName: FormControl;
    formControlDescription: FormControl;

    constructor(private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) data: any,
                private matDialogRef: MatDialogRef<ValidationCreationDialogComponent>)  {
        this.formControlName = formBuilder.control('', [Validators.required]);
        this.formControlDescription = formBuilder.control('', [Validators.required]);
        this.formGroup = formBuilder.group({
            name: this.formControlName,
            description: this.formControlDescription
        });
    }


    onSubmit() {
        this.matDialogRef.close({
            name: this.formControlName.value,
            description: this.formControlDescription.value
        });
    }

    onCancel($event: MouseEvent) {
        this.matDialogRef.close(undefined);
    }
}
