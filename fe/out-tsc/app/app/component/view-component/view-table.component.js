import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ViewEditorDialogComponent } from './view-editor-dialog.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
export class ViewTableDataSource extends DataSource {
    constructor() {
        super(...arguments);
        this.subject = new BehaviorSubject([]);
    }
    connect(collectionViewer) {
        return this.subject.asObservable();
    }
    disconnect(collectionViewer) {
        this.subject.complete();
    }
    update(view) {
        this.subject.next(view);
    }
}
let ViewTableComponent = class ViewTableComponent {
    constructor(matDialog) {
        this.matDialog = matDialog;
        this.counter = -1;
        this.events = new EventEmitter();
        this.pendingSavings = [];
        this.pendingDeletion = [];
        this.selectionModel = new SelectionModel(true);
        this.displayedColumns = ['selection', 'name', 'description', 'actions'];
    }
    ngOnInit() {
        this.dataSource = new ViewTableDataSource();
        this.dataSource.update([...this.views]);
    }
    onEdit($event) {
        if ($event.view) {
            this.pendingSavings.push($event.view);
        }
    }
    canSave() {
        return (this.pendingSavings.length > 0 || this.pendingDeletion.length > 0);
    }
    canDelete() {
        return (this.selectionModel.selected && this.selectionModel.selected.length > 0);
    }
    onAdd($event) {
        this.matDialog.open(ViewEditorDialogComponent, { data: {
                view: { id: this.counter--, name: '', description: '' },
                type: 'all'
            }
        }).afterClosed().pipe(tap((v) => {
            if (v) {
                this.views.unshift(v);
                this.pendingSavings.push(v);
                this.dataSource.update(this.views);
                this.checkBoxChange(false, v);
            }
        })).subscribe();
    }
    onSave($event) {
        this.events.emit({
            type: 'UPDATE',
            updatedViews: this.pendingSavings,
            deletedViews: this.pendingDeletion
        });
        this.pendingSavings = [];
        this.resetCheckboxes();
    }
    onDelete($event) {
        const deleted = this.selectionModel.selected;
        let newViews = this.views;
        deleted.forEach((v) => {
            this.pendingDeletion.push(v);
            newViews = newViews.filter((view) => {
                return view.id !== v.id;
            });
        });
        this.views = newViews;
        this.dataSource.update(this.views);
        this.resetCheckboxes();
    }
    onReload($event) {
        this.events.emit({ type: 'RELOAD' });
        this.resetCheckboxes();
    }
    onCheckboxChange($event, view) {
        this.checkBoxChange($event.checked, view);
    }
    checkBoxChange(checked, view) {
        if (checked) {
            this.selectionModel.select(view);
        }
        else {
            this.selectionModel.deselect(view);
        }
        if (this.selectionModel.selected.length === this.views.length) { // all checkboxes are checked
            this.masterCheckbox.checked = true;
            this.masterCheckbox.indeterminate = false;
        }
        else if (this.selectionModel.selected.length > 0) { // some of the checkboxes are selected
            this.masterCheckbox.checked = false;
            this.masterCheckbox.indeterminate = true;
        }
        else {
            this.masterCheckbox.checked = false;
            this.masterCheckbox.indeterminate = false;
        }
    }
    onMasterCheckboxChange($event) {
        this.masterCheckboxChange($event.checked);
    }
    masterCheckboxChange(checked) {
        if (checked) {
            this.checkboxes.forEach((c) => c.checked = true);
            this.selectionModel.select(...this.views);
        }
        else {
            this.checkboxes.forEach((c) => c.checked = false);
            this.selectionModel.deselect(...this.views);
        }
    }
    resetCheckboxes() {
        this.selectionModel.clear();
        this.checkboxes.forEach((c) => c.checked = false);
        this.masterCheckbox.checked = false;
        this.masterCheckbox.indeterminate = false;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], ViewTableComponent.prototype, "views", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ViewTableComponent.prototype, "events", void 0);
tslib_1.__decorate([
    ViewChild('masterCheckbox', { static: false }),
    tslib_1.__metadata("design:type", MatCheckbox)
], ViewTableComponent.prototype, "masterCheckbox", void 0);
tslib_1.__decorate([
    ViewChildren('checkboxes'),
    tslib_1.__metadata("design:type", QueryList)
], ViewTableComponent.prototype, "checkboxes", void 0);
ViewTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-view-table',
        templateUrl: './view-table.component.html',
        styleUrls: ['./view-table.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [MatDialog])
], ViewTableComponent);
export { ViewTableComponent };
//# sourceMappingURL=view-table.component.js.map