import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {Attribute} from '../../model/attribute.model';
import {TableItem, ItemValTypes, StringValue, Value, Item, ItemImage} from '../../model/item.model';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer, SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {ItemValueAndAttribute, TableItemAndAttribute, TableItemAndAttributeSet} from '../../model/item-attribute.model';
import {createNewItemValue, createNewTableItem} from '../../shared-utils/ui-item-value-creator.utils';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ItemSearchComponentEvent} from '../item-search-component/item-search.component';
import {ItemEditorComponentEvent} from '../data-editor-component/item-editor.component';
import {MatDialog} from "@angular/material/dialog";
import {ItemImageDialogComponent} from "./item-image-dialog.component";
import {tap} from "rxjs/operators";
import {CarouselComponentEvent, CarouselItemImage} from "../carousel-component/carousel.component";
import config from "../../utils/config.util";

export class DataTableDataSource extends DataSource<TableItem> {

  subject: BehaviorSubject<TableItem[]> = new BehaviorSubject([]);

  connect(collectionViewer: CollectionViewer): Observable<TableItem[]> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subject.complete();
  }

  update(items: TableItem[]) {
    this.subject.next(items);
  }
}


export interface DataTableComponentEvent {
  type: 'reload' | 'modification';
  deletedItems?: TableItem[];
  modifiedItems?: TableItem[];
  newItems?: TableItem[];
}

export interface RowInfo {
  tableItem: TableItem;
  expanded: boolean;
}

export interface AttributeInfo {
  attribute: Attribute;
  hidden: boolean;
  order: number;
}



const URL_GET_ITEM_IMAGE = () => `${config().api_host_url}/item/image/:itemImageId`;

@Component({
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
})
export class DataTableComponent implements OnInit, OnChanges {


  static negativeCounter = -1;
  static positiveCounter = 1;

  @Output() events: EventEmitter<DataTableComponentEvent>;
  @Output() searchEvents: EventEmitter<ItemSearchComponentEvent>;
  @Output() carouselEvent: EventEmitter<CarouselComponentEvent>;
  @Input() itemAndAttributeSet: TableItemAndAttributeSet;
  @Input() enableSearch: boolean;

  pendingSavingModifiedItems: Map<number, TableItem>;
  pendingSavingNewItems: Map<number, TableItem>;
  pendingDeletionItems: Map<number, TableItem>;

  datasource: DataTableDataSource;

  displayedColumns: string[]; // the attribute ids
  childrenDisplayedColumns: string[];

  selectionModel: SelectionModel<TableItem>;

  rowInfoMap: Map<number, RowInfo>;   // item id as key
  attributeInfoMap: Map<number, AttributeInfo>; // attribute id as key

  filterOptionsVisible: boolean;

  constructor(private matDialog: MatDialog) {
    this.enableSearch = true;
    this.filterOptionsVisible = false;
    this.events = new EventEmitter();
    this.searchEvents = new EventEmitter();
    this.carouselEvent = new EventEmitter();
    this.selectionModel = new SelectionModel(true, []);
    this.datasource = new DataTableDataSource();

    this.pendingSavingModifiedItems = new Map();
    this.pendingSavingNewItems = new Map();
    this.pendingDeletionItems = new Map();
    this.rowInfoMap = new Map();
    this.attributeInfoMap = new Map();
  }

  ngOnInit(): void {
      this.reload();
  }

  reload() {
    this.pendingSavingModifiedItems.clear();
    this.pendingSavingNewItems.clear();
    this.pendingDeletionItems.clear();
    this.itemAndAttributeSet.tableItems.forEach((i: TableItem, index: number) => {
      this.rowInfoMap.set(i.id, {
        tableItem: i,
        expanded: false,
      } as RowInfo);
    });
    this.itemAndAttributeSet.attributes.forEach((a: Attribute, index: number) => {
      this.attributeInfoMap.set(a.id, {
        attribute: a,
        hidden: false,
        order: index
      } as AttributeInfo);
    });
    this.populateDisplayColumns();
    this.datasource.update([...this.itemAndAttributeSet.tableItems]);
  }

  populateDisplayColumns()  {
    const columns: string[] = this.itemAndAttributeSet.attributes
      .sort((a: Attribute, b: Attribute) => {
        const x = this.attributeInfoMap.get(a.id).order;
        const y = this.attributeInfoMap.get(b.id).order;
        return x - y;
      })
      .filter((a: Attribute) => {
        const attInfo: AttributeInfo = this.attributeInfoMap.get(a.id);
        return (!attInfo.hidden);
      })
      .map((a: Attribute) => {
        return '' + a.id;
      });
    this.displayedColumns = ['selection', 'actions', 'expansion', 'name', 'description', 'creationDate', 'lastUpdate'].concat(columns);
    this.childrenDisplayedColumns = ['children-selection', 'children-actions', 'children-expansion', 'name', 'description', 'creationDate', 'lastUpdate'].concat(columns);
  }


  masterToggle($event: MatCheckboxChange) {
    if (this.itemAndAttributeSet.tableItems.length > 0 &&
        this.selectionModel.selected.length === this.itemAndAttributeSet.tableItems.length) {
      this.selectionModel.clear();
    } else {
      this.itemAndAttributeSet.tableItems.forEach((i: TableItem) => {
        this.selectionModel.select(i);
      });
    }
  }

  hasItemChanges(): boolean {
    return (this.pendingDeletionItems.size > 0 || this.pendingSavingNewItems.size > 0 || this.pendingSavingModifiedItems.size > 0);
  }

  isMasterToggleChecked(): boolean {
    return (this.itemAndAttributeSet.tableItems.length > 0 &&
      this.selectionModel.selected.length === this.itemAndAttributeSet.tableItems.length);
  }

  isMasterToggleIndetermine(): boolean {
    return (this.itemAndAttributeSet.tableItems.length > 0 &&
      this.selectionModel.selected.length > 0 &&
      this.selectionModel.selected.length < this.itemAndAttributeSet.tableItems.length);
  }

  nonMasterToggle($event: MatCheckboxChange, item: TableItem) {
    if (this.selectionModel.isSelected(item)) {
      this.selectionModel.deselect(item);
    } else {
      this.selectionModel.select(item);
    }
  }

  isNonMasterToggleChecked(item: TableItem): boolean {
    return this.selectionModel.isSelected(item);
  }


  onItemEditEvent($event: ItemEditorComponentEvent, tableItem: TableItem) {
    const eventTableItem: TableItem = $event.item as TableItem;
    let ti: TableItem = this.pendingSavingNewItems.has(tableItem.id) ? this.pendingSavingNewItems.get(tableItem.id) : null;
    if (!ti && !this.pendingSavingModifiedItems.has(tableItem.id)) {
      ti = (tableItem.id, {
        id: tableItem.id,
        name: tableItem.name,
        description: tableItem.description,
        parentId: tableItem.parentId,
        rootParentId: tableItem.rootParentId,
        depth: tableItem.depth,
        images: tableItem.images,
        lastUpdate: tableItem.lastUpdate,
        creationDate: tableItem.creationDate,
      } as TableItem);
      this.pendingSavingModifiedItems.set(tableItem.id, ti);
    }
    switch ($event.type) {
      case 'name':
        tableItem.name = eventTableItem.name;
        ti.name = eventTableItem.name;
        break;
      case 'description':
        tableItem.description = eventTableItem.description;
        ti.description = eventTableItem.description;
        break;
    }
  }

  onDataEditEvent($event: ItemValueAndAttribute, tableItem: TableItem) {
     const val: Value = $event.itemValue;
     const value: ItemValTypes = val.val;
     const att: Attribute = $event.attribute;

     let ti: TableItem = this.pendingSavingNewItems.has(tableItem.id) ? this.pendingSavingNewItems.get(tableItem.id) : null;
     if (!ti && !this.pendingSavingModifiedItems.has(tableItem.id)) {
       ti = (tableItem.id, {
         id: tableItem.id,
         name: tableItem.name,
         description: tableItem.description,
         parentId: tableItem.parentId,
         rootParentId: tableItem.rootParentId,
         depth: tableItem.depth,
         images: tableItem.images,
         lastUpdate: tableItem.lastUpdate,
         creationDate: tableItem.creationDate,
       } as TableItem);
       this.pendingSavingModifiedItems.set(tableItem.id, ti);
     }
     ti[$event.attribute.id] = val;
     tableItem[att.id] = val;
  }


  onAddItem($event: MouseEvent) {
    const nextId = DataTableComponent.negativeCounter--;
    const newItem: TableItem = createNewTableItem(nextId, this.itemAndAttributeSet.attributes);
    newItem.name = `New-Item-${DataTableComponent.positiveCounter++}`;
    newItem.depth = 0;
    this.pendingSavingNewItems.set(nextId, newItem);
    this.itemAndAttributeSet.tableItems.push(newItem);
    this.rowInfoMap.set(newItem.id, { tableItem: newItem, expanded: false } as RowInfo);
    this.datasource.update(this.itemAndAttributeSet.tableItems);
  }

  onAddChildrenItem(parentItem: TableItem) {
    const nextId = DataTableComponent.negativeCounter--;
    const newItem: TableItem = createNewTableItem(nextId, this.itemAndAttributeSet.attributes,
        parentItem.id, parentItem.rootParentId ? parentItem.rootParentId : parentItem.id);
    newItem.name = `New-Item-${DataTableComponent.positiveCounter++}`;
    newItem.description = ``;
    newItem.depth = parentItem.depth + 1;

    const f = (tableItem) => {
      if (tableItem) {
        if (tableItem.parentId > 0) {
          const p = this.itemAndAttributeSet.tableItems.find((i: TableItem) => i.id === tableItem.parentId);
          f(p);
        }
        this.pendingSavingNewItems.set(tableItem.id, tableItem);
      }
    };

    // Note: hack
    // so that  'onDataTabularEvent(..)#view-data-tabluar.page.ts' when calling item.service.ts#saveTableItem
    // itemitem-to-table-items.util.ts#toItem(...) can construct the full parent child object for saving in the BE.
    // this.pendingSavingItems.set(parentItem.id, parentItem);
    f(parentItem);
    this.pendingSavingNewItems.set(nextId, newItem);



    const indexOfRootParentItem = this.itemAndAttributeSet.tableItems.findIndex((i: TableItem) => i.id === parentItem.id);
    this.itemAndAttributeSet.tableItems.splice(indexOfRootParentItem + 1, 0, newItem);
    this.datasource.update(this.itemAndAttributeSet.tableItems);
  }

  onDeleteItem($event: MouseEvent) { // deleting root item
    const selectedItems: TableItem[] = this.selectionModel.selected;
    this.onDeleteItem2(selectedItems);
    this.selectionModel.clear();
  }

  onDeleteItem2(items: TableItem[]) { // deleting children item
    let existingItems: TableItem[]  = this.itemAndAttributeSet.tableItems;
    items.forEach((selectedItem: TableItem) => {
      existingItems = existingItems.filter((existingItem: TableItem) => {
        const b1 = (existingItem.id === selectedItem.id);             // keep items that are not this deleted item
        const b2 = (existingItem.rootParentId === selectedItem.id);   // keep child items whose root parent is not this deleted item
        const b3 = (existingItem.parentId === selectedItem.id);       // keep child items whose immediate parent is not this deleted item
        const r = ( // filter out the item and all of it's children
            !(b1 || b2 || b3)
        );
        return r;
      });
      if (selectedItem.id > 0) { // if it is newly added item that have not been saved before deleting it doesn't need savings
        this.pendingDeletionItems.set(selectedItem.id, selectedItem);
      }
      // if it is deleted it doesn't need saving anymore.
      this.pendingSavingNewItems.delete(selectedItem.id);
      this.pendingSavingModifiedItems.delete(selectedItem.id);
    });
    this.itemAndAttributeSet.tableItems = existingItems;
    this.datasource.update(existingItems);
  }

  onSave($event: MouseEvent) {
    const e: DataTableComponentEvent = {
      type: 'modification',
      newItems: Array.from(this.pendingSavingNewItems.values()),
      modifiedItems: Array.from(this.pendingSavingModifiedItems.values()),
      deletedItems: Array.from(this.pendingDeletionItems.values()).filter((i: TableItem) => i.id >= 0),
    } as DataTableComponentEvent;
    this.events.emit(e);
    this.pendingSavingNewItems.clear();
    this.pendingSavingModifiedItems.clear();
    this.pendingDeletionItems.clear();
  }

  onReload($event: MouseEvent) {
    this.pendingSavingNewItems.clear();
    this.pendingDeletionItems.clear();
    this.pendingSavingModifiedItems.clear();
    this.events.emit({type: 'reload'} as DataTableComponentEvent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.itemAndAttributeSet) {
      // const change: SimpleChange = changes.itemAndAttributeSet;
      // this.datasource.update((change.currentValue as TableItemAndAttributeSet).tableItems);
      this.reload();
    }
  }

  rowClicked(item: TableItem) {
    if (!this.rowInfoMap.has(item.id)) {
      this.rowInfoMap.set(item.id, { expanded: false } as RowInfo);
    }
    this.rowInfoMap.get(item.id).expanded = !this.rowInfoMap.get(item.id).expanded;
  }

  isRowExpanded(item: TableItem): boolean {
    if (!this.rowInfoMap.has(item.id)) {
      this.rowInfoMap.set(item.id, { expanded: false } as RowInfo);
    }
    return this.rowInfoMap.get(item.id).expanded;
  }

  isChildRow(index: number, item: TableItem): boolean {
    return !!item.parentId;
  }

  isAnyParentRowExpanded(item: TableItem) {
    const b = this.rowInfoMap.get(item.rootParentId);
    return (b && b.expanded);
  }

  onFilter($event: MouseEvent) {
    this.filterOptionsVisible = !this.filterOptionsVisible;
  }

  onDownAttributeOrdering($event: MouseEvent, attribute: Attribute) {
    const r: AttributeInfo[] = Array.from(this.attributeInfoMap.values())
      .sort((a: AttributeInfo, b: AttributeInfo) => a.order - b.order);
    const i: number = r.findIndex((a: AttributeInfo) => a.attribute.id === attribute.id);
    if ((i <= r.length - 2) && (i >= 0) && (r.length >= 2)) {
      const [x, y] = [r[i].order, r[i + 1].order];
      r[i].order = y;
      r[i + 1].order = x;
    }
    this.populateDisplayColumns();
  }

  onUpAttributeOrdering($event: MouseEvent, attribute: Attribute) {
    const r: AttributeInfo[] = Array.from(this.attributeInfoMap.values())
      .sort((a: AttributeInfo, b: AttributeInfo) => a.order - b.order);
    const i: number = r.findIndex((a: AttributeInfo) => a.attribute.id === attribute.id);
    if (i <= (r.length - 1) && (i > 0) && (r.length >= 2)) {
      const [x, y] = [r[i - 1].order, r[i].order];
      r[i].order = x;
      r[i - 1].order = y;
    }
    this.populateDisplayColumns();
  }

  onAttributeFilteringChanged($event: MatCheckboxChange, attribute: Attribute) {
    this.attributeInfoMap.get(attribute.id).hidden = !$event.checked;
    this.populateDisplayColumns();
  }

  onItemSearchEvent($event: ItemSearchComponentEvent) {
    this.searchEvents.emit($event);
  }

  getItemValue(tableItem: TableItem, attribute: Attribute) {
      let value: Value = tableItem[attribute.id];
      if (!!!value) {
          value = createNewItemValue(attribute, false);
          tableItem[attribute.id] = value;
      }
      return value;
  }

  getCarouselImages(tableItem: TableItem): CarouselItemImage[] {
    if (tableItem && tableItem.images) {
      // const p = `/item/image/:itemImageId`;
      return tableItem.images.map((i: ItemImage) => ({
        ...i,
        itemId: tableItem.id,
        imageUrl: URL_GET_ITEM_IMAGE().replace(':itemImageId', `${i.id}`)
      } as CarouselItemImage));
    }
    return [];
  }

  onEditItemImage(tableItem: TableItem) {
    this.matDialog.open(ItemImageDialogComponent, {
      width: '90vw',
      height: '90vh',
      data: {
        itemId: tableItem.id,
        images: this.getCarouselImages(tableItem)
      }
    })
        .afterClosed()
        .pipe(
            tap((r: CarouselComponentEvent) => {
              if (r) {
                this.carouselEvent.emit(r);
              }
            })
        ).subscribe()
  }
}

