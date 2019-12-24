import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { createNewItemValue, createNewTableItem } from '../../shared-utils/ui-item-value-creator.utils';
import { animate, state, style, transition, trigger } from '@angular/animations';
export class DataTableDataSource extends DataSource {
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
    update(items) {
        this.subject.next(items);
    }
}
let DataTableComponent = class DataTableComponent {
    constructor() {
        this.counter = -1;
        this.filterOptionsVisible = false;
        this.events = new EventEmitter();
        this.searchEvents = new EventEmitter();
        this.selectionModel = new SelectionModel(true, []);
        this.datasource = new DataTableDataSource();
        this.pendingSavingItems = new Map();
        this.pendingDeletionItems = new Map();
        this.rowInfoMap = new Map();
        this.attributeInfoMap = new Map();
    }
    ngOnInit() {
        this.itemAndAttributeSet.tableItems.forEach((i, index) => {
            this.rowInfoMap.set(i.id, {
                tableItem: i,
                expanded: false,
            });
        });
        this.itemAndAttributeSet.attributes.forEach((a, index) => {
            this.attributeInfoMap.set(a.id, {
                attribute: a,
                hidden: false,
                order: index
            });
        });
        this.populateDisplayColumns();
        this.datasource.update([...this.itemAndAttributeSet.tableItems]);
    }
    populateDisplayColumns() {
        const columns = this.itemAndAttributeSet.attributes
            .sort((a, b) => {
            const x = this.attributeInfoMap.get(a.id).order;
            const y = this.attributeInfoMap.get(b.id).order;
            return x - y;
        })
            .filter((a) => {
            const attInfo = this.attributeInfoMap.get(a.id);
            return (!attInfo.hidden);
        })
            .map((a) => {
            return '' + a.id;
        });
        this.displayedColumns = ['selection', 'actions', 'expansion', 'name', 'description'].concat(columns);
        this.childrenDisplayedColumns = ['children-selection', 'children-actions', 'children-expansion', 'name', 'description'].concat(columns);
    }
    masterToggle($event) {
        if (this.itemAndAttributeSet.tableItems.length > 0 &&
            this.selectionModel.selected.length === this.itemAndAttributeSet.tableItems.length) {
            this.selectionModel.clear();
        }
        else {
            this.itemAndAttributeSet.tableItems.forEach((i) => {
                this.selectionModel.select(i);
            });
        }
    }
    hasItemModification() {
        return (this.pendingDeletionItems.size > 0 || this.pendingSavingItems.size > 0);
    }
    isMasterToggleChecked() {
        return (this.itemAndAttributeSet.tableItems.length > 0 &&
            this.selectionModel.selected.length === this.itemAndAttributeSet.tableItems.length);
    }
    isMasterToggleIndetermine() {
        return (this.itemAndAttributeSet.tableItems.length > 0 &&
            this.selectionModel.selected.length > 0 &&
            this.selectionModel.selected.length < this.itemAndAttributeSet.tableItems.length);
    }
    nonMasterToggle($event, item) {
        if (this.selectionModel.isSelected(item)) {
            this.selectionModel.deselect(item);
        }
        else {
            this.selectionModel.select(item);
        }
    }
    isNonMasterToggleChecked(item) {
        return this.selectionModel.isSelected(item);
    }
    onDataEditEvent($event, tableItem) {
        const val = $event.itemValue;
        const value = val.val;
        const att = $event.attribute;
        tableItem[att.id] = val;
        if (!this.pendingSavingItems.has(tableItem.id)) {
            this.pendingSavingItems.set(tableItem.id, Object.assign({}, tableItem));
        }
        this.pendingSavingItems.get(tableItem.id)[$event.attribute.id] = val;
    }
    onItemEditEvent($event, tableItem) {
        const eventTableItem = $event.item;
        if (!this.pendingSavingItems.has(tableItem.id)) {
            this.pendingSavingItems.set(tableItem.id, Object.assign({}, tableItem));
        }
        switch ($event.type) {
            case 'name':
                tableItem.name = eventTableItem.name;
                this.pendingSavingItems.get(tableItem.id).name = eventTableItem.name;
                break;
            case 'description':
                tableItem.description = eventTableItem.description;
                this.pendingSavingItems.get(tableItem.id).description = eventTableItem.description;
                break;
        }
    }
    onAddItem($event) {
        const nextId = this.counter--;
        const newItem = createNewTableItem(nextId, this.itemAndAttributeSet.attributes);
        this.pendingSavingItems.set(nextId, newItem);
        this.itemAndAttributeSet.tableItems.push(newItem);
        this.rowInfoMap.set(newItem.id, { tableItem: newItem, expanded: false });
        this.datasource.update(this.itemAndAttributeSet.tableItems);
    }
    onAddChildrenItem(rootParentItem) {
        const nextId = this.counter--;
        const newItem = createNewTableItem(nextId, this.itemAndAttributeSet.attributes, rootParentItem.id, rootParentItem.rootParentId);
        this.pendingSavingItems.set(nextId, newItem);
        const indexOfRootParentItem = this.itemAndAttributeSet.tableItems.findIndex((i) => i.id === rootParentItem.id);
        this.itemAndAttributeSet.tableItems.splice(indexOfRootParentItem + 1, 0, newItem);
        this.datasource.update(this.itemAndAttributeSet.tableItems);
    }
    onDeleteItem($event) {
        const selectedItems = this.selectionModel.selected;
        this.onDeleteItem2(selectedItems);
        this.selectionModel.clear();
    }
    onDeleteItem2(items) {
        let existingItems = this.itemAndAttributeSet.tableItems;
        items.forEach((selectedItem) => {
            existingItems = existingItems.filter((existingItem) => {
                return ( // filter out the item and all of it's children
                existingItem.id !== selectedItem.id || // the item itself
                    existingItem.rootParentId === selectedItem.id // all of the item's children
                );
            });
            this.pendingDeletionItems.set(selectedItem.id, selectedItem);
        });
        this.itemAndAttributeSet.tableItems = existingItems;
        this.datasource.update(existingItems);
    }
    onSave($event) {
        const e = {
            type: 'modification',
            modifiedItems: Array.from(this.pendingSavingItems.values()),
            deletedItems: Array.from(this.pendingDeletionItems.values()).filter((i) => i.id >= 0),
        };
        this.events.emit(e);
        this.pendingSavingItems.clear();
        this.pendingDeletionItems.clear();
    }
    onReload($event) {
        this.events.emit({ type: 'reload' });
        this.pendingSavingItems.clear();
        this.pendingDeletionItems.clear();
    }
    ngOnChanges(changes) {
        if (changes.itemAndAttributeSet) {
            const change = changes.itemAndAttributeSet;
            this.datasource.update(change.currentValue.tableItems);
        }
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
    isChildRow(index, item) {
        return !!item.parentId;
    }
    isAnyParentRowExpanded(item) {
        const b = this.rowInfoMap.get(item.rootParentId);
        return b.expanded;
    }
    onFilter($event) {
        this.filterOptionsVisible = !this.filterOptionsVisible;
    }
    onDownAttributeOrdering($event, attribute) {
        const r = Array.from(this.attributeInfoMap.values())
            .sort((a, b) => a.order - b.order);
        const i = r.findIndex((a) => a.attribute.id === attribute.id);
        if ((i < r.length - 2) && (i >= 0) && (r.length >= 2)) {
            const [x, y] = [r[i].order, r[i + 1].order];
            r[i].order = y;
            r[i + 1].order = x;
        }
        this.populateDisplayColumns();
    }
    onUpAttributeOrdering($event, attribute) {
        const r = Array.from(this.attributeInfoMap.values())
            .sort((a, b) => a.order - b.order);
        const i = r.findIndex((a) => a.attribute.id === attribute.id);
        if (i < (r.length - 1) && (i > 0) && (r.length >= 2)) {
            const [x, y] = [r[i - 1].order, r[i].order];
            r[i].order = x;
            r[i - 1].order = y;
        }
        this.populateDisplayColumns();
    }
    onAttributeFilteringChanged($event, attribute) {
        this.attributeInfoMap.get(attribute.id).hidden = !$event.checked;
        this.populateDisplayColumns();
    }
    onItemSearchEvent($event) {
        this.searchEvents.emit($event);
    }
    getItemValue(tableItem, attribute) {
        let value = tableItem[attribute.id];
        if (!!!value) {
            value = createNewItemValue(attribute, false);
            tableItem[attribute.id] = value;
        }
        return value;
    }
};
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DataTableComponent.prototype, "events", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DataTableComponent.prototype, "searchEvents", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DataTableComponent.prototype, "itemAndAttributeSet", void 0);
DataTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-data-table',
        templateUrl: './data-table.component.html',
        styleUrls: ['./data-table.component.scss'],
        animations: [
            trigger('detailExpand', [
                state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
                state('expanded', style({ height: '*', visibility: 'visible' })),
                transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
        ],
    }),
    tslib_1.__metadata("design:paramtypes", [])
], DataTableComponent);
export { DataTableComponent };
//# sourceMappingURL=data-table.component.js.map