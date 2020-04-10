import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ItemAndAttributeSet, ItemValueAndAttribute} from '../../model/item-attribute.model';
import {ItemSearchComponentEvent} from '../item-search-component/item-search.component';
import {Item, ItemImage, ItemSearchType} from '../../model/item.model';
import {SelectionModel} from '@angular/cdk/collections';
import {ItemDataEditorDialogComponent} from '../data-thumbnail-component/item-data-editor-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import {map} from 'rxjs/operators';
import {ItemEditorComponentEvent} from '../data-editor-component/item-editor.component';
import {createNewItem} from '../../shared-utils/ui-item-value-creator.utils';
import config from '../../utils/config.util';
import {CarouselComponentEvent, CarouselItemImage} from "../carousel-component/carousel.component";

export interface DataListComponentEvent {
    type: 'modification' | 'reload';
    modifiedItems: Item[]; // only available when type is modification
    deletedItems: Item[];  // only available when type is modification
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

    @Input() itemAndAttributeSet: ItemAndAttributeSet;

    @Output() events: EventEmitter<DataListComponentEvent>;
    @Output() searchEvents: EventEmitter<DataListSearchComponentEvent>;
    @Output() carouselEvents: EventEmitter<CarouselComponentEvent>;

    pendingSaving: Item[];
    pendingDeletion: Item[];
    selectionModel: SelectionModel<Item>;

    constructor(private matDialog: MatDialog) {
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
        this.pendingDeletion.push(...this.selectionModel.selected);
        this.selectionModel.selected.forEach((selectedItem: Item) => {
            const index = this.itemAndAttributeSet.items.findIndex((tmpI: Item) => tmpI.id === selectedItem.id);
            if (index !== -1) {
                this.itemAndAttributeSet.items.splice(index, 1);
            }
        });
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
        this.events.emit({ type: 'reload'} as DataListComponentEvent);
    }

    canSave(): boolean {
        return ((this.pendingSaving.length !== 0) || (this.pendingDeletion.length !== 0));
    }

    canDelete(): boolean {
        return (this.selectionModel.selected && this.selectionModel.selected.length > 0);
    }

    onItemDataChange($event: ItemEditorComponentEvent) {
       const item: Item = this.itemAndAttributeSet.items.find((i: Item) => i.id === $event.item.id);
       const index = this.pendingSaving.findIndex((i: Item) => i.id === $event.item.id);
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

    onAttributeDataChange($event: ItemValueAndAttribute, item: Item) {
        const i: Item = this.pendingSaving.find((tmpI: Item) => tmpI.id === item.id);
        if (!i) {
            this.pendingSaving.push({
                id: item.id,
                [$event.attribute.id]: $event.itemValue
            } as Item);
        } else {
            i[$event.attribute.id] = $event.itemValue;
        }
        const i2: Item = this.itemAndAttributeSet.items.find((tmpI: Item) => tmpI.id === item.id);
        if (i) {
            i[$event.attribute.id] = $event.itemValue;
        }
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
}
