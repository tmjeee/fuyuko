import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataEditorDialogComponent } from './data-editor-dialog.component';
import { map } from 'rxjs/operators';
let DataEditorComponent = class DataEditorComponent {
    constructor(matDialog) {
        this.matDialog = matDialog;
        this.events = new EventEmitter();
    }
    onItemAttributeValueClicked($event) {
        const matDialogRef = this.matDialog.open(DataEditorDialogComponent, {
            data: this.itemValueAndAttribute
        });
        matDialogRef
            .afterClosed()
            .pipe(map((itemAndAttribute) => {
            if (itemAndAttribute) { // 'ok' is clicked when closing dialog
                this.events.emit(this.itemValueAndAttribute);
            }
        })).subscribe();
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DataEditorComponent.prototype, "itemValueAndAttribute", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DataEditorComponent.prototype, "events", void 0);
DataEditorComponent = tslib_1.__decorate([
    Component({
        selector: 'app-data-editor',
        templateUrl: './data-editor.component.html',
        styleUrls: ['./data-editor.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [MatDialog])
], DataEditorComponent);
export { DataEditorComponent };
//# sourceMappingURL=data-editor.component.js.map