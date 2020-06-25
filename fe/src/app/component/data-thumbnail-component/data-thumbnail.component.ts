import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemAndAttributeSet, ItemValueAndAttribute} from '../../model/item-attribute.model';
import {Item, ItemImage, ItemSearchType, TableItem} from '../../model/item.model';
import {SelectionModel} from '@angular/cdk/collections';
import {ItemDataEditorDialogComponent} from './item-data-editor-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {map} from 'rxjs/operators';
import {ItemEditorComponentEvent} from '../data-editor-component/item-editor.component';
import {createNewItem} from '../../shared-utils/ui-item-value-creator.utils';
import config from '../../utils/config.util';
import {CarouselComponentEvent, CarouselItemImage} from "../carousel-component/carousel.component";
import {DataTableComponentEvent} from "../data-table-component/data-table.component";


export interface DataThumbnailSearchComponentEvent {
  type: ItemSearchType;
  search: string;
}

export interface DataThumbnailComponentEvent {
  type: 'modification' | 'reload' | 'favourite' | 'unfavourite';
  modifiedItems: Item[]; // only available when type is modification
  deletedItems: Item[];  // only available when type is modification
  favouritedItems: Item[] // onmly available when type is 'favourite' or 'unfavourite'
}

const URL_GET_ITEM_IMAGE = () => `${config().api_host_url}/item/image/:itemImageId`;

@Component({
  selector: 'app-data-thumbnail',
  templateUrl: './data-thumbnail.component.html',
  styleUrls: ['./data-thumbnail.component.scss']
})
export class DataThumbnailComponent implements OnInit {
  counter: number;

  showMoreMap: Map<number, boolean>; /* <item id, can show more> */
  selectionModel: SelectionModel<Item>;

  @Output() events: EventEmitter<DataThumbnailComponentEvent>;
  @Output() searchEvents: EventEmitter<DataThumbnailSearchComponentEvent>;
  @Output() carouselEvents: EventEmitter<CarouselComponentEvent>;

  pendingSaving: Item[];
  pendingDeletion: Item[];

  @Input() enableSearch: boolean;
  @Input() itemAndAttributeSet: ItemAndAttributeSet;
  @Input() favouritedItemIds: number[];

  constructor(private matDialog: MatDialog) {
    this.favouritedItemIds = [];
    this.enableSearch = true
    this.showMoreMap = new Map();
    this.selectionModel = new SelectionModel(true);
    this.pendingSaving = [];
    this.pendingDeletion = [];
    this.events = new EventEmitter();
    this.searchEvents = new EventEmitter();
    this.carouselEvents = new EventEmitter();
    this.counter = -1;
  }

  ngOnInit(): void {
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

  isShowMore(item: Item) {
    if (this.showMoreMap.has(item.id)) {
      return this.showMoreMap.get(item.id);
    } else {
      this.showMoreMap.set(item.id, false);
      return false;
    }
  }

  showMore($event: MouseEvent, item: Item) {
    $event.preventDefault();
    $event.stopImmediatePropagation();
    const showMore: boolean = this.isShowMore(item);
    this.showMoreMap.set(item.id, !showMore);
  }

  onItemEditorEvent($event: ItemEditorComponentEvent, item: Item) {
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

  onDataEditorEvent($event: ItemValueAndAttribute, item: Item) {
    let i: Item = this.pendingSaving.find((tmpI: Item) => tmpI.id === item.id);
    if (!i) {
      i = {
        id: item.id,
        name: item.name,
        description: item.description,
        images: item.images,
        parentId: item.parentId,
        creationDate: item.creationDate,
        lastUpdate: item.lastUpdate
      } as Item;
      this.pendingSaving.push(i);
    }
    // save in both the pendingSaving's copy and the original
    i[$event.attribute.id] = $event.itemValue;
    item[$event.attribute.id] = $event.itemValue;
  }


  canSave(): boolean {
    return ((this.pendingSaving.length !== 0) || (this.pendingDeletion.length !== 0));
  }

  canDelete(): boolean {
    return (this.selectionModel.selected && this.selectionModel.selected.length > 0);
  }

  reload($event: MouseEvent) {
    this.pendingDeletion = [];
    this.pendingSaving = [];
    this.events.emit({ type: 'reload'} as DataThumbnailComponentEvent);
  }


  save($event: MouseEvent) {
    this.events.emit({
      type: 'modification',
      deletedItems: [...this.pendingDeletion],
      modifiedItems: [...this.pendingSaving]
    } as DataThumbnailComponentEvent);
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

  editItem(item: Item) {
    const id =  --this.counter;
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
            const index0: number = this.itemAndAttributeSet.items.findIndex((i: Item) => i.id === r.id);
            if (index0 >= 0) {
              this.itemAndAttributeSet.items.splice(index0, 1, r);
            } else {
              this.itemAndAttributeSet.items.push(r);
            }
            const index1 = this.pendingSaving.findIndex((i: Item) => i.id === r.id);
            if (index1 >= 0) {
              this.pendingSaving.splice(index1, 1, r);
            } else {
              this.pendingSaving.push(r);
            }
          }
        })
      ).subscribe();
  }

  onItemSearchEvent($event: DataThumbnailSearchComponentEvent) {
    this.searchEvents.emit($event);
  }


  onCheckboxChangeEvent($event: MatCheckboxChange, item: Item) {
    if ($event.checked) {
      this.selectionModel.select(item);
    } else {
      this.selectionModel.deselect(item);
    }
  }

  onCarouselEvent($event: CarouselComponentEvent) {
      this.carouselEvents.emit($event);
  }

  onFavouriteItem(item: Item) {
    this.events.emit({
      type: 'favourite',
      favouritedItems: [item]
    } as DataThumbnailComponentEvent);
  }

  onUnfavouriteItem(item: Item) {
    this.events.emit({
      type: 'unfavourite',
      favouritedItems: [item]
    } as DataThumbnailComponentEvent);
  }

  isFavouriteItem(tableItem: TableItem): boolean {
    return (this.favouritedItemIds ? this.favouritedItemIds.includes(tableItem.id) : false);
  }
}
