import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ItemDataEditorDialogComponent } from '../data-thumbnail-component/item-data-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { createNewItem } from '../../shared-utils/ui-item-value-creator.utils';
import config from '../../utils/config.util';
const URL_GET_ITEM_IMAGE = `${config.api_host_url}/item/image/:itemImageId`;
let DataListComponent = class DataListComponent {
    constructor(matDialog) {
        this.matDialog = matDialog;
        this.counter = 0;
        this.selectionModel = new SelectionModel(true);
        this.pendingSaving = [];
        this.pendingDeletion = [];
        this.events = new EventEmitter();
        this.searchEvents = new EventEmitter();
    }
    getItemImagesUrl(item) {
        if (item && item.images) {
            // const p = `/item/image/:itemImageId`;
            return item.images.map((i) => URL_GET_ITEM_IMAGE.replace(':itemImageId', `${i.id}`));
        }
        return [];
    }
    onItemSearchEvent($event) {
        this.searchEvents.emit($event);
    }
    save($event) {
        this.events.emit({
            type: 'modification',
            deletedItems: [...this.pendingDeletion],
            modifiedItems: [...this.pendingSaving]
        });
        this.pendingDeletion = [];
        this.pendingSaving = [];
    }
    delete($event) {
        const i = this.selectionModel.selected;
        this.pendingDeletion.push(...this.selectionModel.selected);
        this.selectionModel.selected.forEach((selectedItem) => {
            const index = this.itemAndAttributeSet.items.findIndex((tmpI) => tmpI.id === selectedItem.id);
            if (index !== -1) {
                this.itemAndAttributeSet.items.splice(index, 1);
            }
        });
        this.selectionModel.clear();
    }
    addItem($event) {
        const id = --this.counter;
        const item = createNewItem(id, this.itemAndAttributeSet.attributes);
        this.matDialog.open(ItemDataEditorDialogComponent, {
            data: {
                attributes: this.itemAndAttributeSet.attributes,
                item
            }
        }).afterClosed()
            .pipe(map((r) => {
            if (r) {
                this.pendingSaving.push(r);
                this.itemAndAttributeSet.items.unshift(r);
            }
        })).subscribe();
    }
    reload($event) {
        this.events.emit({ type: 'reload' });
    }
    canSave() {
        return ((this.pendingSaving.length !== 0) || (this.pendingDeletion.length !== 0));
    }
    canDelete() {
        return (this.selectionModel.selected && this.selectionModel.selected.length > 0);
    }
    onItemDataChange($event) {
        const item = this.itemAndAttributeSet.items.find((i) => i.id === $event.item.id);
        const index = this.pendingSaving.findIndex((i) => i.id === $event.item.id);
        if (index === -1) {
            this.pendingSaving.push(item);
        }
        switch ($event.type) {
            case 'name':
                item.name = $event.item.name;
                break;
            case 'description':
                item.description = $event.item.description;
                break;
        }
    }
    onAttributeDataChange($event, item) {
        const i = this.pendingSaving.find((tmpI) => tmpI.id === item.id);
        if (!i) {
            this.pendingSaving.push({
                id: item.id,
                [$event.attribute.id]: $event.itemValue
            });
        }
        else {
            i[$event.attribute.id] = $event.itemValue;
        }
        const i2 = this.itemAndAttributeSet.items.find((tmpI) => tmpI.id === item.id);
        if (i) {
            i[$event.attribute.id] = $event.itemValue;
        }
    }
    onCheckboxStateChange($event, item) {
        if ($event.checked) {
            this.selectionModel.select(item);
        }
        else {
            this.selectionModel.deselect(item);
        }
        return false;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DataListComponent.prototype, "itemAndAttributeSet", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DataListComponent.prototype, "events", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DataListComponent.prototype, "searchEvents", void 0);
DataListComponent = tslib_1.__decorate([
    Component({
        selector: 'app-data-list',
        templateUrl: './data-list.component.html',
        styleUrls: ['./data-list.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [MatDialog])
], DataListComponent);
export { DataListComponent };
//# sourceMappingURL=data-list.component.js.map