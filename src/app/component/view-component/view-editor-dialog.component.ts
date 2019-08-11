import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {View} from '../../model/view.model';
import {Type} from './view-editor.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    templateUrl: './view-editor-dialog.component.html',
    styleUrls: ['./view-editor-dialog.component.scss']
})
export class ViewEditorDialogComponent {

    formGroup: FormGroup;
    formControlName: FormControl;
    formControlDescription: FormControl;


    constructor(private matDialogRef: MatDialogRef<ViewEditorDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private data: {view: View, type: Type}) {
        this.formGroup = formBuilder.group({});
        switch (data.type) {
            case 'name':
                this.formControlName = this.formBuilder.control(data.view.name, [Validators.required]);
                this.formGroup.addControl('name', this.formControlName);
                break;
            case 'description':
                this.formControlDescription = this.formBuilder.control(data.view.description, [Validators.required]);
                this.formGroup.addControl('description', this.formControlDescription);
                break;
            case 'all':
                this.formControlName = this.formBuilder.control(data.view.name, [Validators.required]);
                this.formGroup.addControl('name', this.formControlName);
                this.formControlDescription = this.formBuilder.control(data.view.description, [Validators.required]);
                this.formGroup.addControl('description', this.formControlDescription);
                break;
        }
    }

    onSubmit() {
        switch (this.data.type) {
            case 'name':
                this.data.view.name = this.formControlName.value;
                break;
            case 'description':
                this.data.view.description = this.formControlDescription.value;
                break;
            case 'all':
                this.data.view.name = this.formControlName.value;
                this.data.view.description = this.formControlDescription.value;
                break;
        }
        this.matDialogRef.close(this.data.view);
    }

    onCancel($event: MouseEvent) {
        this.matDialogRef.close(undefined);
    }
}
