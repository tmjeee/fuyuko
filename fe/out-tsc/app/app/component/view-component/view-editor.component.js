import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewEditorDialogComponent } from './view-editor-dialog.component';
import { tap } from 'rxjs/operators';
let ViewEditorComponent = class ViewEditorComponent {
    constructor(matDialog) {
        this.matDialog = matDialog;
        this.events = new EventEmitter();
    }
    onEdit($event, description) {
        this.matDialog.open(ViewEditorDialogComponent, {
            data: Object.assign({ view: this.view, type: this.type })
        })
            .afterClosed()
            .pipe(tap((r) => {
            if (r) {
                switch (this.type) {
                    case 'name':
                        this.view.name = r.name;
                        break;
                    case 'description':
                        this.view.description = r.description;
                        break;
                    case 'all':
                        this.view.name = r.name;
                        this.view.description = r.description;
                        break;
                }
                this.events.emit({
                    view: this.view,
                    type: this.type
                });
            }
        })).subscribe();
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], ViewEditorComponent.prototype, "view", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], ViewEditorComponent.prototype, "type", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ViewEditorComponent.prototype, "events", void 0);
ViewEditorComponent = tslib_1.__decorate([
    Component({
        selector: 'app-view-editor',
        templateUrl: './view-editor.component.html',
        styleUrls: ['./view-editor.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [MatDialog])
], ViewEditorComponent);
export { ViewEditorComponent };
//# sourceMappingURL=view-editor.component.js.map