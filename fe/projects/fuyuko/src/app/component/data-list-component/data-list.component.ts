import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ItemAndAttributeSet, ItemValueAndAttribute} from '@fuyuko-common/model/item-attribute.model';
import {ItemSearchComponentEvent} from '../item-search-component/item-search.component';
import {Item, ItemImage, ItemSearchType} from '@fuyuko-common/model/item.model';
import {SelectionModel} from '@angular/cdk/collections';
import {ItemDataEditorDialogComponent} from '../data-thumbnail-component/item-data-editor-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import {map} from 'rxjs/operators';
import {ItemEditorComponentEvent} from '../data-editor-component/item-editor.component';
import {createNewItem} from '@fuyuko-common/shared-utils/ui-item-value-creator.utils';
import config from '../../utils/config.util';
import {CarouselComponentEvent, CarouselItemImage} from '../carousel-component/carousel.component';

export interface DataListComponentEvent {
    type: 'modification' | 'reload' | 'favourite' | 'unfavourite';
    modifiedItems: Item[]; // only available when type is modification
    deletedItems: Item[];  // only available when type is modification
    favouritedItems: Item[]; // onmly available when type is 'favourite' or 'unfavourite'
}

export interface DataListSearchComponentEvent {
    type: ItemSearchType;
    search: string;
}

const URL_GET_ITEM_IMAGE = () => `${config().api_host_url}/item/image/:itemImageId`;

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent {
    counter: number;

    @Input() enableSearch: boolean;
    @Input() itemAndAttributeSet: ItemAndAttributeSet;
    @Input() favouritedItemIds: number[];

    @Output() events: EventEmitter<DataListComponentEvent>;
    @Output() searchEvents: EventEmitter<DataListSearchComponentEvent>;
    @Output() carouselEvents: EventEmitter<CarouselComponentEvent>;

    pendingSaving: Item[];
    pendingDeletion: Item[];
    selectionModel: SelectionModel<Item>;

    constructor(private matDialog: MatDialog) {
        this.enableSearch = true;
        this.counter = 0;
        this.selectionModel = new SelectionModel(true);
        this.pendingSaving = [];
        this.pendingDeletion = [];
        this.events = new EventEmitter();
        this.searchEvents = new EventEmitter();
        this.carouselEvents = new EventEmitter();
    }

    getCarouselImages(item: Item): CarouselItemImage[] {
        if (item && item.images) {
            // const p = `/item/image/:itemImageId`;
            return item.images.map((i: ItemImage) => ({
                ...i,
                itemId: item.id,
                imageUrl: URL_GET_ITEM_IMAGE().replace(':itemImageId', `${i.id}`)
            } as CarouselItemImage));
        }
        return [];
    }

    onItemSearchEvent($event: ItemSearchComponentEvent) {
        this.searchEvents.emit($event);
    }

    save($event: MouseEvent) {
        this.events.emit({
            type: 'modification',
            deletedItems: [...this.pendingDeletion],
            modifiedItems: [...this.pendingSaving]
        } as DataListComponentEvent);
        this.pendingDeletion = [];
        this.pendingSaving = [];
    }

    delete($event: MouseEvent) {
        const i: Item[] = this.selectionModel.selected;
        for (const _i of i) {
            if (_i.id > 0) { // delete of persisted item only
                this.pendingDeletion.push(_i);
            }
            this.pendingSaving = this.pendingSaving.filter((i: Item) => i.id != _i.id);
            const index = this.itemAndAttributeSet.items.findIndex((tmpI: Item) => tmpI.id === _i.id);
            if (index !== -1) {
                this.itemAndAttributeSet.items.splice(index, 1);
            }
        }
        this.selectionModel.clear();
    }

    addItem($event: MouseEvent) {
        const id =  --this.counter;
        const item: Item = createNewItem(id, this.itemAndAttributeSet.attributes);
        this.matDialog.open(ItemDataEditorDialogComponent, {
            width: `90vw`,
            height: `90vh`,
            data: {
                attributes: this.itemAndAttributeSet.attributes,
                item
            }
        }).afterClosed()
            .pipe(
                map((r: Item) => {
                    if (r) {
                        this.pendingSaving.push(r);
                        this.itemAndAttributeSet.items.unshift(r);
                    }
                })
            ).subscribe();
    }


    reload($event: MouseEvent) {
        this.pendingDeletion = [];
        this.pendingSaving = [];
        this.events.emit({ type: 'reload'} as DataListComponentEvent);
    }

    canSave(): boolean {
        return ((this.pendingSaving.length !== 0) || (this.pendingDeletion.length !== 0));
    }

    canDelete(): boolean {
        return (this.selectionModel.selected && this.selectionModel.selected.length > 0);
    }

    onItemDataChange($event: ItemEditorComponentEvent, item: Item) {
       let itm = this.pendingSaving.find((i: Item) => i.id === $event.item.id);
       if (!itm) {
           itm = {
               id: item.id,
               name: item.name,
               description: item.description,
               images: item.images,
               parentId: item.parentId,
               creationDate: item.creationDate,
               lastUpdate: item.lastUpdate
           } as Item;
           this.pendingSaving.push(itm);
       }
        // save in both the pendingSaving's copy and the original
       switch ($event.type) {
           case 'name':
               item.name = $event.item.name;
               itm.name = $event.item.name;
               break;
           case 'description':
               item.description = $event.item.description;
               itm.description = $event.item.description;
               break;
       }
    }

    onAttributeDataChange($event: ItemValueAndAttribute, item: Item) {
        const i: Item = this.pendingSaving.find((tmpI: Item) => tmpI.id === item.id);
        if (!i) {
            this.pendingSaving.push({
                id: item.id,
                name: item.name,
                description: item.description,
                images: item.images,
                parentId: item.parentId,
                creationDate: item.creationDate,
                lastUpdate: item.lastUpdate
            } as Item);
        }
        // save in both the pendingSaving's copy and the original
        i[$event.attribute.id] = $event.itemValue;
        item[$event.attribute.id] = $event.itemValue;
    }

    onCheckboxStateChange($event: MatCheckboxChange, item: Item) {
        if ($event.checked) {
            this.selectionModel.select(item);
        } else {
            this.selectionModel.deselect(item);
        }
        return false;
    }

    onCarouselEvent($event: CarouselComponentEvent) {
        this.carouselEvents.emit($event);
    }

    onFavouriteItem(item: Item) {
        this.events.emit({
            type: 'favourite',
            favouritedItems: [item]
        } as DataListComponentEvent);
    }

    onUnfavouriteItem(item: Item) {
        this.events.emit({
            type: 'unfavourite',
            favouritedItems: [item]
        } as DataListComponentEvent);
    }

    isFavouriteItem(item: Item): boolean {
        return (this.favouritedItemIds ? this.favouritedItemIds.includes(item.id) : false);
    }
}
