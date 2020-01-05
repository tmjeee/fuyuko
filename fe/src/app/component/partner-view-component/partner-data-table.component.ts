import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PricedItem, TableItem, TablePricedItem, Value} from '../../model/item.model';
import {CollectionViewer, DataSource, SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {Attribute} from '../../model/attribute.model';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {createNewItemValue} from '../../shared-utils/ui-item-value-creator.utils';
import {MatSidenav} from "@angular/material/sidenav";

export class DataTableDataSource extends DataSource<TablePricedItem> {

    subject: BehaviorSubject<TablePricedItem[]> = new BehaviorSubject([]);

    connect(collectionViewer: CollectionViewer): Observable<TablePricedItem[]> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(items: TablePricedItem[]) {
        this.subject.next(items);
    }
}


export interface RowInfo {
    tableItem: TablePricedItem;
    expanded: boolean;
}


export interface AttributeInfo {
    attribute: Attribute;
    hidden: boolean;
    order: number;
}

@Component({
    selector: 'app-partner-data-table',
    templateUrl: './partner-data-table.component.html',
    styleUrls: ['./partner-data-table.component.scss']

})
export class PartnerDataTableComponent implements OnInit {

    @Input() attributes: Attribute[];
    @Input() tablePricedItems: TablePricedItem[];

    @ViewChild('sideNav', {static: true}) sideNav: MatSidenav;

    selectionModel: SelectionModel<TablePricedItem>;

    rowInfoMap: Map<number, RowInfo>;   // item id as key
    attributeInfoMap: Map<number, AttributeInfo>; // attribute id as key


    displayedColumns: string[]; // the attribute ids
    childrenDisplayedColumns: string[];

    datasource: DataTableDataSource;

    constructor() {
        this.datasource = new DataTableDataSource();
        this.selectionModel = new SelectionModel(true, []);
        this.rowInfoMap = new Map();
        this.attributeInfoMap = new Map();
    }

    ngOnInit(): void {
        this.tablePricedItems.forEach((i: TablePricedItem, index: number) => {
            this.rowInfoMap.set(i.id, {
                tableItem: i,
                expanded: false,
            } as RowInfo);
        });
        this.populateDisplayColumns();
        this.datasource.update([...this.tablePricedItems]);
    }

    populateDisplayColumns()  {
        const columns: string[] = this.attributes
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

    isMasterToggleChecked(): boolean {
        return (this.tablePricedItems.length > 0 &&
            this.selectionModel.selected.length === this.tablePricedItems.length);
    }

    isMasterToggleIndetermine(): boolean {
        return (this.tablePricedItems.length > 0 &&
            this.selectionModel.selected.length > 0 &&
            this.selectionModel.selected.length < this.tablePricedItems.length);
    }

    masterToggle($event: MatCheckboxChange) {
        if (this.tablePricedItems.length > 0 &&
            this.selectionModel.selected.length === this.tablePricedItems.length) {
            this.selectionModel.clear();
        } else {
            this.tablePricedItems.forEach((i: TablePricedItem) => {
                this.selectionModel.select(i);
            });
        }
    }

    isNonMasterToggleChecked(item: TablePricedItem): boolean {
        return this.selectionModel.isSelected(item);
    }

    nonMasterToggle($event: MatCheckboxChange, item: any) {
        if (this.selectionModel.isSelected(item)) {
            this.selectionModel.deselect(item);
        } else {
            this.selectionModel.select(item);
        }
    }

    isRowExpanded(item: TableItem): boolean {
        if (!this.rowInfoMap.has(item.id)) {
            this.rowInfoMap.set(item.id, { expanded: false } as RowInfo);
        }
        return this.rowInfoMap.get(item.id).expanded;
    }

    rowClicked(item: TablePricedItem) {
        if (!this.rowInfoMap.has(item.id)) {
            this.rowInfoMap.set(item.id, { expanded: false } as RowInfo);
        }
        this.rowInfoMap.get(item.id).expanded = !this.rowInfoMap.get(item.id).expanded;
    }


    isChildRow(index: number, item: TablePricedItem): boolean {
        return !!item.parentId;
    }


    isAnyParentRowExpanded(item: TablePricedItem) {
        const b = this.rowInfoMap.get(item.rootParentId);
        return b.expanded;
    }

    getItemValue(tableItem: TableItem, attribute: Attribute) {
        let value: Value = tableItem[attribute.id];
        if (!!!value) {
            value = createNewItemValue(attribute, false);
            tableItem[attribute.id] = value;
        }
        return value;
    }

    onViewDetailsClicked(tableItem: any) {
        this.sideNav.open();
    }

    onCloseSideNav($event: MouseEvent) {
        this.sideNav.close();
    }
}
