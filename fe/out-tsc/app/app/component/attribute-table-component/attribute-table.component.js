import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditAttributeDialogComponent } from './edit-attribute-dialog.component';
import { map } from 'rxjs/operators';
class AttributeTableDataSource extends DataSource {
    constructor() {
        super(...arguments);
        this.subject = new BehaviorSubject(null);
    }
    connect(collectionViewer) {
        return this.subject.asObservable();
    }
    disconnect(collectionViewer) {
        this.subject.complete();
    }
    update(attributes) {
        this.subject.next(attributes);
    }
}
let AttributeTableComponent = class AttributeTableComponent {
    constructor(formBuilder, matDialog) {
        this.formBuilder = formBuilder;
        this.matDialog = matDialog;
        this.displayedColumns = ['name', 'type', 'description', 'metadata', 'actions'];
        this.formControlAttributeSearch = this.formBuilder.control('');
        this.dataSource = new AttributeTableDataSource();
        this.events = new EventEmitter();
    }
    onAttributeSearchTriggered($event) {
        this.events.emit({
            type: 'search',
            view: this.view,
            search: this.formControlAttributeSearch.value
        });
    }
    onCancelClicked($event, attribute) {
        this.events.emit({
            type: 'delete',
            view: this.view,
            attribute
        });
    }
    ngOnChanges(changes) {
        if (changes.attributes) {
            const simpleChange = changes.attributes;
            const attributes = simpleChange.currentValue;
            this.dataSource.update(attributes);
        }
    }
    onAddAttributeClick($event) {
        const attribute = {
            id: -1,
            type: 'string',
            name: '',
            description: ''
        };
        this.popupEditDialog('add', attribute);
    }
    onEditClicked($event, attribute) {
        this.popupEditDialog('edit', attribute);
    }
    popupEditDialog(command, attribute) {
        const matDialogRef = this.matDialog.open(EditAttributeDialogComponent, {
            data: attribute,
            minWidth: 600,
        });
        matDialogRef.afterClosed()
            .pipe(map((a) => {
            if (a) {
                this.events.emit({
                    type: command,
                    view: this.view,
                    attribute: a
                });
            }
        })).subscribe();
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AttributeTableComponent.prototype, "searchFieldLabel", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AttributeTableComponent.prototype, "searchFieldHint", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AttributeTableComponent.prototype, "searchFieldPlaceholder", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AttributeTableComponent.prototype, "view", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], AttributeTableComponent.prototype, "attributes", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AttributeTableComponent.prototype, "events", void 0);
AttributeTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-attribute-table',
        templateUrl: './attribute-table.component.html',
        styleUrls: ['./attribute-table.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder, MatDialog])
], AttributeTableComponent);
export { AttributeTableComponent };
//# sourceMappingURL=attribute-table.component.js.map