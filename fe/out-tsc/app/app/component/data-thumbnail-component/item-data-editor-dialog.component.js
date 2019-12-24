import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { copyAttrProperties } from '../../utils/item-to-table-items.util';
let ItemDataEditorDialogComponent = class ItemDataEditorDialogComponent {
    constructor(matDialogRef, data) {
        this.matDialogRef = matDialogRef;
        this.data = data;
        this.hasChange = false;
        this.item = Object.assign({}, this.data.item);
        copyAttrProperties(this.data.item, this.item);
        this.attributes = this.data.attributes;
    }
    onItemNameChange($event) {
        this.hasChange = true;
        this.item.name = $event.item.name;
    }
    onItemDescriptionChange($event) {
        this.hasChange = true;
        this.item.description = $event.item.description;
    }
    onItemAttributeChange($event) {
        this.hasChange = true;
        this.item[$event.attribute.id] = $event.itemValue;
    }
    onSubmit($event) {
        this.matDialogRef.close(this.item);
    }
    onCancel($event) {
        this.matDialogRef.close(null);
    }
};
ItemDataEditorDialogComponent = tslib_1.__decorate([
    Component({
        templateUrl: './item-data-editor-dialog.component.html',
        styleUrls: ['./item-data-editor-dialog.component.scss']
    }),
    tslib_1.__param(1, Inject(MAT_DIALOG_DATA)),
    tslib_1.__metadata("design:paramtypes", [MatDialogRef, Object])
], ItemDataEditorDialogComponent);
export { ItemDataEditorDialogComponent };
//# sourceMappingURL=item-data-editor-dialog.component.js.map