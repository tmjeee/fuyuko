import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {
    PricingStructure,
    PricingStructureItemWithPrice,
    PricingStructureWithItems,
    TablePricingStructureItemWithPrice
} from '../../model/pricing-structure.model';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import {PricingStructureService} from '../../service/pricing-structure-service/pricing-structure.service';
import {tap} from 'rxjs/operators';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';
import {PricingStructurePopupComponent} from './pricing-structure-popup.component';
import {ItemPricePopupComponent} from './item-price-popup.component';
import {toTablePricingStructureItemWithPrice} from '../../utils/item-to-table-items.util';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {View} from '../../model/view.model';


export interface RowInfo {
    tableItem: PricingStructureItemWithPrice;
    expanded: boolean;
}


export class PricingStructureItemsTableDataSource extends DataSource<TablePricingStructureItemWithPrice> {

    private subject: BehaviorSubject<TablePricingStructureItemWithPrice[]>;

    connect(collectionViewer: CollectionViewer):
        Observable<TablePricingStructureItemWithPrice[] | ReadonlyArray<TablePricingStructureItemWithPrice>> {
        this.subject = new BehaviorSubject<TablePricingStructureItemWithPrice[]>([]);
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(items: TablePricingStructureItemWithPrice[]) {
        this.subject.next(items);
    }

}

export interface PricingStructureEvent {
    type: 'new-pricing-structure' | 'delete-pricing-structure' |
        'edit-pricing-structure' | 'edit-pricing-item';
    pricingStructure?: PricingStructure; // for new / edit /remove of PricingStructure
    pricingStructureItem?: TablePricingStructureItemWithPrice; // for edit / remove of PricingStructureItemWithPrice
}

export interface PricingStructureInput {
    pricingStructures: PricingStructure[];
    currentPricingStructure: PricingStructure;
}


@Component({
    selector: 'app-pricing-structure-table',
    templateUrl: './pricing-structure-table.component.html',
    styleUrls: ['./pricing-structure-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden', display: 'none'})),
            state('expanded', style({height: '*',  visibility: 'visible', display: 'table-row'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class PricingStructureTableComponent implements OnInit, OnChanges {

    @Input() pricingStructureInput: PricingStructureInput;
    @Input() fetchFn: (pricingStructureId: number) => Observable<PricingStructureWithItems>;
    @Input() views: View[];
    @Output() events: EventEmitter<PricingStructureEvent>;

    // currently selected ones
    pricingStructure: PricingStructure;
    pricingStructureWithItems: PricingStructureWithItems;
    tablePricingStructureItemsWithPrice: TablePricingStructureItemWithPrice[];

    dataSource: PricingStructureItemsTableDataSource;

    rowInfoMap: Map<number, RowInfo>;   // item id as key (the parent)


    constructor(private matDialog: MatDialog) {
        this.dataSource = new PricingStructureItemsTableDataSource();
        this.events = new EventEmitter();
        this.views = [];
        this.rowInfoMap = new Map();
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const simpleChange: SimpleChange = changes.pricingStructureInput;
        if (simpleChange.currentValue) {
            const ps: PricingStructure = (simpleChange.currentValue as PricingStructureInput).currentPricingStructure;
            this.pricingStructure = (ps ? this.pricingStructureInput.pricingStructures.find((p) => p.id === ps.id) : null);
            this.reload(this.pricingStructure);
        }
    }

    viewForPricingStructure(pricingStructure: PricingStructure): View {
        if (pricingStructure && pricingStructure.viewId) {
            return this.views.find((v: View) => v.id === pricingStructure.viewId);
        }
        return null;
    }

    onPricingStructureSelectionChanged($event: MatSelectChange) {
        this.pricingStructure = $event.value as PricingStructure;
        this.reload(this.pricingStructure);
    }

    reload(pricingStructure: PricingStructure) {
        this.pricingStructureWithItems = undefined;
        this.tablePricingStructureItemsWithPrice = [];
        this.rowInfoMap = new Map();
        if (pricingStructure && pricingStructure.id) {
            this.fetchFn(pricingStructure.id)
                .pipe(
                    tap((p: PricingStructureWithItems) => {
                        if (p && p.items) {
                            this.pricingStructureWithItems = p;
                            this.pricingStructureWithItems.items.forEach((item: PricingStructureItemWithPrice) => {
                                this.rowInfoMap.set(item.id, { tableItem: item, expanded: false } as RowInfo);
                            });
                            this.tablePricingStructureItemsWithPrice =
                                toTablePricingStructureItemWithPrice(this.pricingStructureWithItems.items);
                            setTimeout(() => {
                                this.dataSource.update([...this.tablePricingStructureItemsWithPrice]);
                            });
                        }
                    })
                ).subscribe();
        } else {
            this.tablePricingStructureItemsWithPrice = [];
        }
    }

    onNewPricingStructure($event: MouseEvent) {
        this.matDialog.open(PricingStructurePopupComponent,
            {
                width: '90vw',
                height: '90vh',
                data: { views: this.views, pricingStructure: null}
            } as MatDialogConfig)
            .afterClosed().pipe(
                tap((r: PricingStructure) => {
                    if (r) {
                        this.events.emit({
                           type: 'new-pricing-structure',
                           pricingStructure: r
                        } as PricingStructureEvent);
                    }
                })
            ).subscribe();
    }

    onEditPricingStructure($event: MouseEvent, pricingStructure: PricingStructure) {
        this.matDialog.open(PricingStructurePopupComponent,
            {
                width: '90vw',
                height: '90vh',
                data: { views: this.views, pricingStructure}
            } as MatDialogConfig)
            .afterClosed().pipe(
                tap((r: PricingStructure) => {
                    if (r) {
                       this.events.emit({
                           type: 'edit-pricing-structure',
                           pricingStructure: r
                       } as PricingStructureEvent);
                    }
                })
            ).subscribe();
    }

    onDeletePricingStructure($event: MouseEvent, pricingStructure: PricingStructure) {
        this.events.emit({
            type: 'delete-pricing-structure',
            pricingStructure
        } as PricingStructureEvent);
    }


    onEditPricingStructureItem($event: MouseEvent, pricingStructureItem: TablePricingStructureItemWithPrice) {
        this.matDialog.open(ItemPricePopupComponent, {
            width: '90vw',
            height: '90vh',
            data: pricingStructureItem
        } as MatDialogConfig)
            .afterClosed().pipe(
            tap((r: TablePricingStructureItemWithPrice) => {
                if (r) {
                    this.events.emit({
                        type: 'edit-pricing-item',
                        pricingStructure: this.pricingStructure,
                        pricingStructureItem: r
                    } as PricingStructureEvent);
                }
            })
        ).subscribe();
    }


    isRowExpanded(item: TablePricingStructureItemWithPrice): boolean {
        if (!this.rowInfoMap.has(item.id)) {
            this.rowInfoMap.set(item.id, { expanded: false } as RowInfo);
        }
        return this.rowInfoMap.get(item.id).expanded;
    }

    isChildRow(index: number, item: TablePricingStructureItemWithPrice): boolean {
        return !!item.parentId;
    }

    isAnyParentRowExpanded(item: TablePricingStructureItemWithPrice) {
        const b = this.rowInfoMap.get(item.rootParentId);
        return b.expanded;
    }

    rowClicked(item: TablePricingStructureItemWithPrice) {
        if (!this.rowInfoMap.has(item.id)) {
            this.rowInfoMap.set(item.id, { expanded: false } as RowInfo);
        }
        this.rowInfoMap.get(item.id).expanded = !this.rowInfoMap.get(item.id).expanded;
    }
}
