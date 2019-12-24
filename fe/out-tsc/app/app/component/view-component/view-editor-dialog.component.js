import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
let ViewEditorDialogComponent = class ViewEditorDialogComponent {
    constructor(matDialogRef, formBuilder, data) {
        this.matDialogRef = matDialogRef;
        this.formBuilder = formBuilder;
        this.data = data;
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
    onCancel($event) {
        this.matDialogRef.close(undefined);
    }
};
ViewEditorDialogComponent = tslib_1.__decorate([
    Component({
        templateUrl: './view-editor-dialog.component.html',
        styleUrls: ['./view-editor-dialog.component.scss']
    }),
    tslib_1.__param(2, Inject(MAT_DIALOG_DATA)),
    tslib_1.__metadata("design:paramtypes", [MatDialogRef,
        FormBuilder, Object])
], ViewEditorDialogComponent);
export { ViewEditorDialogComponent };
//# sourceMappingURL=view-editor-dialog.component.js.map