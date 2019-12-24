import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
let ItemEditorDialogComponent = class ItemEditorDialogComponent {
    constructor(matDialogRef, formBuilder, data) {
        this.matDialogRef = matDialogRef;
        this.formBuilder = formBuilder;
        this.data = data;
        this.type = data.type;
        this.item = data.item;
        if (this.type === 'name') {
            this.formControlName = formBuilder.control(this.item.name, [Validators.required]);
            this.formGroup = this.formBuilder.group({
                name: this.formControlName
            });
        }
        else if (this.type === 'description') {
            this.formControlDescription = formBuilder.control(this.item.description, [Validators.required]);
            this.formGroup = this.formBuilder.group({
                description: this.formControlDescription
            });
        }
    }
    onSubmit() {
        const item = Object.assign({}, this.item);
        if (this.type === 'name') {
            item.name = this.formControlName.value;
        }
        else if (this.type === 'description') {
            item.description = this.formControlDescription.value;
        }
        this.matDialogRef.close(item);
    }
    cancel($event) {
        this.matDialogRef.close(undefined);
    }
};
ItemEditorDialogComponent = tslib_1.__decorate([
    Component({
        templateUrl: './item-editor-dialog.component.html',
        styleUrls: ['./item-editor-dialog.component.scss']
    }),
    tslib_1.__param(2, Inject(MAT_DIALOG_DATA)),
    tslib_1.__metadata("design:paramtypes", [MatDialogRef,
        FormBuilder, Object])
], ItemEditorDialogComponent);
export { ItemEditorDialogComponent };
//# sourceMappingURL=item-editor-dialog.component.js.map