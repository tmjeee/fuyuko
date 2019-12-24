import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
let NotificationDialogComponent = class NotificationDialogComponent {
    constructor(matDialogRef, data) {
        this.matDialogRef = matDialogRef;
        this.data = data;
    }
    onClose(event) {
        this.matDialogRef.close();
    }
};
NotificationDialogComponent = tslib_1.__decorate([
    Component({
        templateUrl: './notification-dialog.component.html',
        styleUrls: ['./notification-dialog.component.scss']
    }),
    tslib_1.__param(1, Inject(MAT_DIALOG_DATA)),
    tslib_1.__metadata("design:paramtypes", [MatDialogRef, Array])
], NotificationDialogComponent);
export { NotificationDialogComponent };
//# sourceMappingURL=notification-dialog.component.js.map