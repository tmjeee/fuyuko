import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TableItem, TablePricedItem, Value} from '@fuyuko-common/model/item.model';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {createNewItemValue} from '@fuyuko-common/shared-utils/ui-item-value-creator.utils';
import {MatSidenav} from '@angular/material/sidenav';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {assertDefinedReturn} from '../../utils/common.util';

export class DataTableDataSource extends DataSource<TablePricedItem> {

    subject: BehaviorSubject<TablePricedItem[]> = new BehaviorSubject([] as TablePricedItem[]);

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
    styleUrls: ['./partner-data-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
            state('expanded', style({ height: '*', visibility: 'visible' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class PartnerDataTableComponent implements OnInit {

    @Input() attributes: Attribute[] = [];
    @Input() tablePricedItems: TablePricedItem[] = [];
    selectedTablePricedItem?: TablePricedItem;

    @ViewChild('sideNav', {static: true}) sideNav!: MatSidenav;

    rowInfoMap: Map<number, RowInfo>;   // item id as key
    attributeInfoMap: Map<number, AttributeInfo>; // attribute id as key


    displayedColumns!: string[]; // the attribute ids
    childrenDisplayedColumns!: string[];

    datasource: DataTableDataSource;

    constructor() {
        this.datasource = new DataTableDataSource();
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
        this.attributes.forEach((a: Attribute, index: number) => {
            this.attributeInfoMap.set(a.id, {
                attribute: a,
                hidden: false,
                order: index
            } as AttributeInfo);
        });
        this.populateDisplayColumns();
        this.datasource.update([...this.tablePricedItems]);
    }

    populateDisplayColumns()  {
        const columns: string[] = this.attributes
            .sort((a: Attribute, b: Attribute) => {
                const x = this.attributeInfoMap.get(a.id) ? assertDefinedReturn(this.attributeInfoMap.get(a.id)).order : 0;
                const y = this.attributeInfoMap.get(b.id) ? assertDefinedReturn(this.attributeInfoMap.get(b.id)).order : 0;
                return x - y;
            })
            .filter((a: Attribute) => {
                const attInfo: AttributeInfo | undefined = this.attributeInfoMap.get(a.id);
                return (attInfo ? !attInfo.hidden : false);
            })
            .map((a: Attribute) => {
                return '' + a.id;
            });
        this.displayedColumns = ['actions', 'expansion', 'name', 'description', 'price', 'priceCountry'].concat(columns);
        this.childrenDisplayedColumns =
            ['children-actions', 'children-expansion', 'name', 'description', 'price', 'priceCountry'].concat(columns);
    }

    isRowExpanded(item: TableItem): boolean {
        if (!this.rowInfoMap.has(item.id)) {
            this.rowInfoMap.set(item.id, { expanded: false } as RowInfo);
        }
        return assertDefinedReturn(this.rowInfoMap.get(item.id)).expanded;
    }

    rowClicked(item: TablePricedItem) {
        if (!this.rowInfoMap.has(item.id)) {
            this.rowInfoMap.set(item.id, { expanded: false } as RowInfo);
        }
        assertDefinedReturn(this.rowInfoMap.get(item.id)).expanded = !assertDefinedReturn(this.rowInfoMap.get(item.id)).expanded;
    }


    isChildRow(index: number, item: TablePricedItem): boolean {
        return !!item.parentId;
    }


    isAnyParentRowExpanded(item: TablePricedItem) {
        const b = this.rowInfoMap.get(item.rootParentId);
        return (b ? b.expanded : false);
    }

    getItemValue(tableItem: TableItem, attribute: Attribute) {
        let value: Value = tableItem[attribute.id];
        if (!!!value) {
            value = createNewItemValue(attribute, false);
            tableItem[attribute.id] = value;
        }
        return value;
    }

    onViewDetailsClicked(tableItem: TablePricedItem) {
        const isSame = this.selectedTablePricedItem === tableItem;
        this.selectedTablePricedItem = tableItem;
        if (isSame) {
            this.sideNav.toggle();
        } else {
            this.sideNav.close();
            this.sideNav.open();
        }
    }

    onCloseSideNav($event: MouseEvent) {
        this.sideNav.close();
    }
}
