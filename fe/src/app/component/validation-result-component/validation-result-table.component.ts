import {CollectionViewer, DataSource, SelectionModel} from '@angular/cdk/collections';
import {Item, ItemValTypes, TableItem, Value} from '../../model/item.model';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Attribute} from '../../model/attribute.model';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ItemValueAndAttribute, TableItemAndAttributeSet} from '../../model/item-attribute.model';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ItemEditorComponentEvent} from '../data-editor-component/item-editor.component';
import {createNewItemValue} from '../../shared-utils/ui-item-value-creator.utils';
import {MatRadioChange} from '@angular/material/radio';
import {tap} from 'rxjs/operators';
import {Validation, ValidationError, ValidationResult} from "../../model/validation.model";
import {Rule} from "../../model/rule.model";
import {ValidationErrors} from "@angular/forms";

export class ValidationResultTableDataSource extends DataSource<TableItem> {

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

export interface ValidationResultTableComponentEvent {
    type: 'reload' | 'modification' | 'selection-changed';
    modifiedItems?: TableItem[]; // only when type = 'modification' or 'selection-changed';
    errors?: ValidationError[]; // only when type = 'selection-changed'
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
    selector: 'app-validation-result-table',
    templateUrl: './validation-result-table.component.html',
    styleUrls: ['./validation-result-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
            state('expanded', style({ height: '*', visibility: 'visible' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class ValidationResultTableComponent implements OnInit, OnDestroy, OnChanges {


    counter = -1;

    @Output() events: EventEmitter<ValidationResultTableComponentEvent>;
    @Input() itemAndAttributeSet: TableItemAndAttributeSet;
    @Input() observable: Observable<Item>;
    @Input() rules: Rule[];
    @Input() validationResult: ValidationResult;

    subscription: Subscription;

    pendingSavingItems: Map<number, TableItem>;

    datasource: ValidationResultTableDataSource;

    displayedColumns: string[]; // the attribute ids
    childrenDisplayedColumns: string[];

    selectionModel: SelectionModel<TableItem>;

    rowInfoMap: Map<number, RowInfo>;   // item id as key
    attributeInfoMap: Map<number, AttributeInfo>; // attribute id as key

    filterOptionsVisible: boolean;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        this.filterOptionsVisible = false;
        this.events = new EventEmitter();
        this.selectionModel = new SelectionModel(false, []);
        this.datasource = new ValidationResultTableDataSource();
        this.pendingSavingItems = new Map();
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
        if (this.observable) {
            this.subscription = this.observable
                .pipe(
                    tap((i: Item) => {
                        if (i) {
                            this.handleExternalItemChange(i);
                        }
                    })
                ).subscribe();
            console.log('**** table subscribed');
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    rowSelectedCss(n: TableItem): boolean {
        return this.selectionModel.isSelected(n);
    }

    handleExternalItemChange(i: Item) {
        console.log('*** table received item change ', i);
        const t: TableItem = this.itemAndAttributeSet.tableItems.find((ti: TableItem) => ti.id === i.id);
        if (t) {
            this.selectionModel.select(t);
            this.changeDetectorRef.detectChanges();
        }
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
        this.childrenDisplayedColumns =
            ['children-selection', 'children-actions', 'children-expansion', 'name', 'description'].concat(columns);
    }



    hasItemModification(): boolean {
        return (this.pendingSavingItems.size > 0);
    }


    nonMasterToggle($event: MatRadioChange, item: TableItem) {
        this.selectionModel.select(item);
        this.events.emit({
            type: 'selection-changed',
            modifiedItems: [item],
            errors: this.validationResult.errors
        });
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


    onSave($event: MouseEvent) {
        const e: ValidationResultTableComponentEvent = {
            type: 'modification',
            modifiedItems: Array.from(this.pendingSavingItems.values()),
        };
        this.events.emit(e);
        this.pendingSavingItems.clear();
    }

    onReload($event: MouseEvent) {
        this.events.emit({type: 'reload'} as ValidationResultTableComponentEvent);
        this.pendingSavingItems.clear();
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

    getItemValue(tableItem: TableItem, attribute: Attribute) {
        let value: Value = tableItem[attribute.id];
        if (!!!value) {
            value = createNewItemValue(attribute, false);
            tableItem[attribute.id] = value;
        }
        return value;
    }

}


