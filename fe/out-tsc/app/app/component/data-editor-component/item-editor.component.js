import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemEditorDialogComponent } from './item-editor-dialog.component';
import { map } from 'rxjs/operators';
let ItemEditorComponent = class ItemEditorComponent {
    constructor(matDialog) {
        this.matDialog = matDialog;
        this.events = new EventEmitter();
    }
    onEdit($event, name) {
        const matDialogRef = this.matDialog.open(ItemEditorDialogComponent, {
            data: {
                item: Object.assign({}, this.item),
                type: this.type
            }
        });
        matDialogRef
            .afterClosed()
            .pipe(map((r) => {
            if (r) {
                this.events.emit({
                    item: Object.assign({}, r),
                    type: this.type
                });
            }
        })).subscribe();
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], ItemEditorComponent.prototype, "item", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], ItemEditorComponent.prototype, "type", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ItemEditorComponent.prototype, "events", void 0);
ItemEditorComponent = tslib_1.__decorate([
    Component({
        selector: 'app-item-editor',
        templateUrl: './item-editor.component.html',
        styleUrls: ['./item-editor.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [MatDialog])
], ItemEditorComponent);
export { ItemEditorComponent };
//# sourceMappingURL=item-editor.component.js.map