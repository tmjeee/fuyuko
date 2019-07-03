import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ItemAndAttributeSet, ItemValueAndAttribute} from '../../model/item-attribute.model';
import {Item} from '../../model/item.model';
import {SelectionModel} from '@angular/cdk/collections';
import {ItemDataEditorDialogComponent} from './item-data-editor-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {map} from 'rxjs/operators';
import {ItemSearchComponentEvent, SearchType} from '../item-search-component/item-search.component';


export interface DataThumbnailSearchComponentEvent {
  type: SearchType;
  search: string;
}

export interface DataThumbnailComponentEvent {
  type: 'delete' | 'save' | 'reload';
  modifiedItems: Item[]; // only available when type is save
  deletedItems: Item[];  // only available when type is delete
}

@Component({
  selector: 'app-data-thumbnail',
  templateUrl: './data-thumbnail.component.html',
  styleUrls: ['./data-thumbnail.component.scss']
})
export class DataThumbnailComponent {
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
    this.selectionModel = new SelectionModel();
    this.pendingSaving = [];
    this.events = new EventEmitter();
    this.searchEvents = new EventEmitter();
    this.counter = -1;
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
    const i: Item = this.pendingSaving.find((i: Item) => i.id === item.id);
    if (!i) {
      this.pendingSaving.push({
        id: item.id,
        [$event.attribute.id]: $event.itemValue
      } as Item);
    } else {
      i[$event.attribute.id] = $event.itemValue;
    }
  }


  canSave(): boolean {
    return (this.pendingSaving.length !== 0);
  }

  canDelete(): boolean {
    return (this.selectionModel.selected && this.selectionModel.selected.length > 0);
  }

  reload($event: MouseEvent) {
    this.events.emit({ type: 'reload'} as DataThumbnailComponentEvent)
  }


  save($event: MouseEvent) {
    this.events.emit({
      type: 'save',
      deletedItems: [...this.pendingDeletion],
      modifiedItems: [...this.pendingDeletion]
    } as DataThumbnailComponentEvent);
  }

  delete($event: MouseEvent) {
    const i: Item[] = this.selectionModel.selected;
    this.pendingDeletion.push(...this.selectionModel.selected);
    this.selectionModel.selected.forEach((selectedItem: Item) => {
      const index = this.itemAndAttributeSet.items.findIndex((i: Item) => i.id === selectedItem.id);
      if (index !== -1) {
        this.itemAndAttributeSet.items.splice(index, 1);
      }
    });
    this.selectionModel.clear();
  }

  addItem($event: MouseEvent) {
    const id =  --this.counter;
    this.matDialog.open(ItemDataEditorDialogComponent, {
      data: {
        attributes: this.itemAndAttributeSet.attributes,
        item: {
          id: this.counter--,
        } as Item
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
            const index1 = this.pendingSaving.findIndex((i: Item) => i.id === r.id);
            if (index1 >= 0) {
              this.pendingSaving.splice(index1, 1, r);
            }
            const index2 = this.itemAndAttributeSet.items.findIndex((i: Item) => i.id === r.id);
            if (index2 >= 0) {
              this.itemAndAttributeSet.items.splice(index2, 1, r);
            }
          }
        })
      ).subscribe();
  }

  onItemSearchEvent($event: DataThumbnailSearchComponentEvent) {
    this.searchEvents.emit($event);
  }
}
