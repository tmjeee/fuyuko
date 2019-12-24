import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ItemDataEditorDialogComponent } from './item-data-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { createNewItem } from '../../shared-utils/ui-item-value-creator.utils';
import config from '../../utils/config.util';
const URL_GET_ITEM_IMAGE = `${config.api_host_url}/item/image/:itemImageId`;
let DataThumbnailComponent = class DataThumbnailComponent {
    constructor(matDialog) {
        this.matDialog = matDialog;
        this.showMoreMap = new Map();
        this.selectionModel = new SelectionModel(true);
        this.pendingSaving = [];
        this.pendingDeletion = [];
        this.events = new EventEmitter();
        this.searchEvents = new EventEmitter();
        this.counter = -1;
    }
    ngOnInit() {
    }
    getItemImagesUrl(item) {
        if (item && item.images) {
            // const p = `/item/image/:itemImageId`;
            return item.images.map((i) => URL_GET_ITEM_IMAGE.replace(':itemImageId', `${i.id}`));
        }
        return [];
    }
    isShowMore(item) {
        if (this.showMoreMap.has(item.id)) {
            return this.showMoreMap.get(item.id);
        }
        else {
            this.showMoreMap.set(item.id, false);
            return false;
        }
    }
    showMore($event, item) {
        $event.preventDefault();
        $event.stopImmediatePropagation();
        const showMore = this.isShowMore(item);
        this.showMoreMap.set(item.id, !showMore);
    }
    onDataEditorEvent($event, item) {
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
    canSave() {
        return ((this.pendingSaving.length !== 0) || (this.pendingDeletion.length !== 0));
    }
    canDelete() {
        return (this.selectionModel.selected && this.selectionModel.selected.length > 0);
    }
    reload($event) {
        this.events.emit({ type: 'reload' });
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
    editItem(item) {
        const id = --this.counter;
        this.matDialog.open(ItemDataEditorDialogComponent, {
            data: {
                attributes: this.itemAndAttributeSet.attributes,
                item
            }
        }).afterClosed()
            .pipe(map((r) => {
            if (r) {
                const tmpItem = this.itemAndAttributeSet.items.find((i) => i.id === r.id);
                const index1 = this.pendingSaving.findIndex((i) => i.id === r.id);
                if (index1 >= 0) {
                    this.pendingSaving.splice(index1, 1, tmpItem);
                }
                else {
                    this.pendingSaving.push(tmpItem);
                }
            }
        })).subscribe();
    }
    onItemSearchEvent($event) {
        this.searchEvents.emit($event);
    }
    onItemEditorEvent($event) {
        const item = this.itemAndAttributeSet.items.find((i) => i.id === $event.item.id);
        switch ($event.type) {
            case 'name':
                item.name = $event.item.name;
                break;
            case 'description':
                item.description = $event.item.description;
                break;
        }
        const index = this.pendingSaving.findIndex((i) => i.id === $event.item.id);
        if (index === -1) {
            this.pendingSaving.push(item);
        }
    }
    onCheckboxChangeEvent($event, item) {
        if ($event.checked) {
            this.selectionModel.select(item);
        }
        else {
            this.selectionModel.deselect(item);
        }
    }
};
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DataThumbnailComponent.prototype, "events", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DataThumbnailComponent.prototype, "searchEvents", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DataThumbnailComponent.prototype, "itemAndAttributeSet", void 0);
DataThumbnailComponent = tslib_1.__decorate([
    Component({
        selector: 'app-data-thumbnail',
        templateUrl: './data-thumbnail.component.html',
        styleUrls: ['./data-thumbnail.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [MatDialog])
], DataThumbnailComponent);
export { DataThumbnailComponent };
//# sourceMappingURL=data-thumbnail.component.js.map