import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {Attribute} from '../../model/attribute.model';
import {TableItem, ItemValTypes, StringValue, Value} from '../../model/item.model';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer, SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatCheckboxChange} from '@angular/material';
import {ItemValueAndAttribute, TableItemAndAttribute, TableItemAndAttributeSet} from '../../model/item-attribute.model';
import {createNewTableItem} from '../../utils/ui-item-value-setter.util';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ItemSearchComponentEvent} from '../item-search-component/item-search.component';
import {ItemEditorComponentEvent} from '../data-editor-component/item-editor.component';

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


  counter = -1;

  @Output() events: EventEmitter<DataTableComponentEvent>;
  @Output() searchEvents: EventEmitter<ItemSearchComponentEvent>;
  @Input() itemAndAttributeSet: TableItemAndAttributeSet;

  pendingSavingItems: Map<number, TableItem>;
  pendingDeletionItems: Map<number, TableItem>;

  datasource: DataTableDataSource;

  displayedColumns: string[]; // the attribute ids
  childrenDisplayedColumns: string[];

  selectionModel: SelectionModel<TableItem>;

  rowInfoMap: Map<number, RowInfo>;   // item id as key
  attributeInfoMap: Map<number, AttributeInfo>; // attribute id as key

  filterOptionsVisible: boolean;

  constructor() {
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

  ngOnInit(): void {
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
    this.displayedColumns = ['selection', 'actions', 'expansion', 'name', 'description'].concat(columns);
    this.childrenDisplayedColumns = ['children-selection', 'children-actions', 'children-expansion', 'name', 'description'].concat(columns);
  }


  masterToggle($event: MatCheckboxChange) {
    if (this.itemAndAttributeSet.tableItems.length > 0 &&
        this.selectionModel.selected.length === this.itemAndAttributeSet.tableItems.length) {
      console.log('clear');
      this.selectionModel.clear();
    } else {
      this.itemAndAttributeSet.tableItems.forEach((i: TableItem) => {
        console.log('select ', i);
        this.selectionModel.select(i);
      });
    }
  }

  hasItemModification(): boolean {
    return (this.pendingDeletionItems.size > 0 || this.pendingSavingItems.size > 0);
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

  nonMasterToggle($event: MatCheckboxChange, item: any) {
    if (this.selectionModel.isSelected(item)) {
      this.selectionModel.deselect(item);
    } else {
      this.selectionModel.select(item);
    }
  }

  isNonMasterToggleChecked(item: TableItem): boolean {
    return this.selectionModel.isSelected(item);
  }

  onDataEditEvent($event: ItemValueAndAttribute, tableItem: TableItem) {
     const val: Value = $event.itemValue;
     const value: ItemValTypes = val.val;
     const att: Attribute = $event.attribute;

     tableItem[att.id] = val;
     if (!this.pendingSavingItems.has(tableItem.id)) {
       this.pendingSavingItems.set(tableItem.id, {...tableItem});
     }
     this.pendingSavingItems.get(tableItem.id)[$event.attribute.id] = val;
  }

  onItemEditEvent($event: ItemEditorComponentEvent, tableItem: TableItem) {
    const eventTableItem: TableItem = $event.item as TableItem;
    if (!this.pendingSavingItems.has(tableItem.id)) {
      this.pendingSavingItems.set(tableItem.id, {...tableItem});
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

  onAddItem($event: MouseEvent) {
    const nextId = this.counter--;
    const newItem: TableItem = createNewTableItem(nextId, this.itemAndAttributeSet.attributes);
    this.pendingSavingItems.set(nextId, newItem);
    this.itemAndAttributeSet.tableItems.push(newItem);
    this.rowInfoMap.set(newItem.id, { tableItem: newItem, expanded: false } as RowInfo);
    this.datasource.update(this.itemAndAttributeSet.tableItems);
  }

  onAddChildrenItem(rootParentItem: TableItem) {
    const nextId = this.counter--;
    const newItem: TableItem = createNewTableItem(nextId, this.itemAndAttributeSet.attributes, rootParentItem.id, rootParentItem.rootParentId);
    this.pendingSavingItems.set(nextId, newItem);
    const indexOfRootParentItem = this.itemAndAttributeSet.tableItems.findIndex((i: TableItem) => i.id === rootParentItem.id);
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
        return ( // filter out the item and all of it's children
          existingItem.id !== selectedItem.id ||           // the item itself
          existingItem.rootParentId === selectedItem.id   // all of the item's children
        );
      });
      this.pendingDeletionItems.set(selectedItem.id, selectedItem);
    });
    this.itemAndAttributeSet.tableItems = existingItems;
    this.datasource.update(existingItems);
  }

  onSave($event: MouseEvent) {
    const e: DataTableComponentEvent = {
      type: 'modification',
      modifiedItems: Array.from(this.pendingSavingItems.values()),
      deletedItems: Array.from(this.pendingDeletionItems.values()).filter((i: TableItem) => i.id >= 0),
    } as DataTableComponentEvent;
    this.events.emit(e);
    this.pendingSavingItems.clear();
    this.pendingDeletionItems.clear();
  }

  onReload($event: MouseEvent) {
    this.events.emit({type: 'reload'} as DataTableComponentEvent);
    this.pendingSavingItems.clear();
    this.pendingDeletionItems.clear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.itemAndAttributeSet) {
      const change: SimpleChange = changes.itemAndAttributeSet;
      this.datasource.update((change.currentValue as TableItemAndAttributeSet).tableItems);
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
    return b.expanded;
  }

  onFilter($event: MouseEvent) {
    this.filterOptionsVisible = !this.filterOptionsVisible;
  }

  onDownAttributeOrdering($event: MouseEvent, attribute: Attribute) {
    const r: AttributeInfo[] = Array.from(this.attributeInfoMap.values())
      .sort((a: AttributeInfo, b: AttributeInfo) => a.order - b.order);
    const i: number = r.findIndex((a: AttributeInfo) => a.attribute.id === attribute.id);
    if ((i < r.length - 2) && (i >= 0) && (r.length >= 2)) {
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
    if (i < (r.length - 1) && (i > 0) && (r.length >= 2)) {
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

}

