import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemAndAttributeSet, ItemValueAndAttribute} from '../../model/item-attribute.model';
import {Item, ItemImage} from '../../model/item.model';
import {SelectionModel} from '@angular/cdk/collections';
import {ItemDataEditorDialogComponent} from './item-data-editor-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {map} from 'rxjs/operators';
import {ItemSearchComponentEvent, SearchType} from '../item-search-component/item-search.component';
import {ItemEditorComponentEvent} from '../data-editor-component/item-editor.component';
import {createNewItem} from '../../shared-utils/ui-item-value-creator.utils';
import config from '../../utils/config.util';


export interface DataThumbnailSearchComponentEvent {
  type: SearchType;
  search: string;
}

export interface DataThumbnailComponentEvent {
  type: 'modification' | 'reload';
  modifiedItems: Item[]; // only available when type is modification
  deletedItems: Item[];  // only available when type is modification
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

  pendingSaving: Item[];
  pendingDeletion: Item[];

  @Input() itemAndAttributeSet: ItemAndAttributeSet;

  constructor(private matDialog: MatDialog) {
    this.showMoreMap = new Map();
    this.selectionModel = new SelectionModel(true);
    this.pendingSaving = [];
    this.pendingDeletion = [];
    this.events = new EventEmitter();
    this.searchEvents = new EventEmitter();
    this.counter = -1;
  }

  ngOnInit(): void {
  }


  getItemImagesUrl(item: Item): string[] {
    if (item && item.images) {
      // const p = `/item/image/:itemImageId`;
      return item.images.map((i: ItemImage) => URL_GET_ITEM_IMAGE().replace(':itemImageId', `${i.id}`));
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

  onDataEditorEvent($event: ItemValueAndAttribute, item: Item) {
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


  canSave(): boolean {
    return ((this.pendingSaving.length !== 0) || (this.pendingDeletion.length !== 0));
  }

  canDelete(): boolean {
    return (this.selectionModel.selected && this.selectionModel.selected.length > 0);
  }

  reload($event: MouseEvent) {
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
      data: {
        attributes: this.itemAndAttributeSet.attributes,
        item
      }
    }).afterClosed()
      .pipe(
        map((r: Item) => {
          if (r) {
            const tmpItem: Item = this.itemAndAttributeSet.items.find((i: Item) => i.id === r.id);
            const index1 = this.pendingSaving.findIndex((i: Item) => i.id === r.id);
            if (index1 >= 0) {
              this.pendingSaving.splice(index1, 1, tmpItem);
            } else {
              this.pendingSaving.push(tmpItem);
            }
          }
        })
      ).subscribe();
  }

  onItemSearchEvent($event: DataThumbnailSearchComponentEvent) {
    this.searchEvents.emit($event);
  }

  onItemEditorEvent($event: ItemEditorComponentEvent) {
      const item: Item = this.itemAndAttributeSet.items.find((i: Item) => i.id === $event.item.id);
      switch ($event.type) {
        case 'name':
          item.name = $event.item.name;
          break;
        case 'description':
          item.description = $event.item.description;
          break;
      }
      const index = this.pendingSaving.findIndex((i: Item) => i.id === $event.item.id);
      if (index === -1) {
          this.pendingSaving.push(item);
      }
  }

  onCheckboxChangeEvent($event: MatCheckboxChange, item: Item) {
    if ($event.checked) {
      this.selectionModel.select(item);
    } else {
      this.selectionModel.deselect(item);
    }
  }

}
