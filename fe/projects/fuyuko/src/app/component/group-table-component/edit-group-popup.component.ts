import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Group} from '@fuyuko-common/model/group.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
    templateUrl: './edit-group-popup.component.html',
    styleUrls: ['./edit-group-popup.component.scss']
})
export class EditGroupPopupComponent {

    group: Group;

    formGroup: FormGroup;
    formControlName: FormControl;
    formControlDescription: FormControl;

    constructor(private matDialogRef: MatDialogRef<EditGroupPopupComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private data: Group) {
        this.group = {...data};
        this.formControlName = this.formBuilder.control('', [Validators.required]);
        this.formControlDescription = this.formBuilder.control('', [Validators.required]);
        this.formGroup = this.formBuilder.group({
            name: this.formControlName,
            description: this.formControlDescription
        });
        this.formControlName.setValue(this.group?.name);
        this.formControlDescription.setValue(this.group?.description);
    }


    onSubmit() {
        this.group.id = (this.group.id ? this.group.id : -1);
        this.group.name = this.formControlName.value;
        this.group.description = this.formControlDescription.value;
        this.matDialogRef.close(this.group);
    }

    onCancel($event: MouseEvent) {
       this.matDialogRef.close(null);
    }
}
