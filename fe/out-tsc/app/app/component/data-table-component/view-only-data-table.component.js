import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { toTableItem } from '../../utils/item-to-table-items.util';
import { BehaviorSubject } from 'rxjs';
class ViewOnlyDataTableDatasource {
    constructor() {
        this.subject = new BehaviorSubject([]);
    }
    connect(collectionViewer) {
        return this.subject.asObservable();
    }
    disconnect(collectionViewer) {
        this.subject.complete();
    }
    update(tableItems) {
        this.subject.next(tableItems);
    }
}
let ViewOnlyDataTableComponent = class ViewOnlyDataTableComponent {
    ngOnInit() {
        this.reload();
    }
    reload() {
        this.rowInfoMap = new Map();
        this.datasource = new ViewOnlyDataTableDatasource();
        this.displayColumns = ['expansion', 'name', 'description'].concat(...this.attributes.map((a) => ('' + a.id)));
        this.tableItems = toTableItem(this.items);
        this.tableItems.forEach((t) => {
            this.rowInfoMap.set(t.id, {
                tableItem: t,
                expanded: false,
            });
        });
        this.datasource.update(this.tableItems);
    }
    isChildRow(index, item) {
        return !!item.parentId;
    }
    isAnyParentRowExpanded(item) {
        const b = this.rowInfoMap.get(item.rootParentId);
        return b.expanded;
    }
    rowClicked(item) {
        if (!this.rowInfoMap.has(item.id)) {
            this.rowInfoMap.set(item.id, { expanded: false });
        }
        this.rowInfoMap.get(item.id).expanded = !this.rowInfoMap.get(item.id).expanded;
    }
    isRowExpanded(item) {
        if (!this.rowInfoMap.has(item.id)) {
            this.rowInfoMap.set(item.id, { expanded: false });
        }
        return this.rowInfoMap.get(item.id).expanded;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], ViewOnlyDataTableComponent.prototype, "attributes", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], ViewOnlyDataTableComponent.prototype, "items", void 0);
ViewOnlyDataTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-view-only-data-table',
        templateUrl: './view-only-data-table.component.html',
        styleUrls: ['./view-only-data-table.component.scss']
    })
], ViewOnlyDataTableComponent);
export { ViewOnlyDataTableComponent };
//# sourceMappingURL=view-only-data-table.component.js.map