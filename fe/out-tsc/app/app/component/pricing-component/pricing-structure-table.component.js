import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { tap } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/table';
import { PricingStructurePopupComponent } from './pricing-structure-popup.component';
import { ItemPricePopupComponent } from './item-price-popup.component';
import { toTablePricingStructureItemWithPrice } from '../../utils/item-to-table-items.util';
import { animate, state, style, transition, trigger } from '@angular/animations';
export class PricingStructureItemsTableDataSource extends DataSource {
    connect(collectionViewer) {
        this.subject = new BehaviorSubject([]);
        return this.subject.asObservable();
    }
    disconnect(collectionViewer) {
        this.subject.complete();
    }
    update(items) {
        this.subject.next(items);
    }
}
let PricingStructureTableComponent = class PricingStructureTableComponent {
    constructor(matDialog) {
        this.matDialog = matDialog;
        this.dataSource = new PricingStructureItemsTableDataSource();
        this.events = new EventEmitter();
        this.rowInfoMap = new Map();
    }
    ngOnInit() {
    }
    ngOnChanges(changes) {
        const simpleChange = changes.pricingStructureInput;
        if (simpleChange.currentValue) {
            const ps = simpleChange.currentValue.currentPricingStructure;
            this.pricingStructure = (ps ? this.pricingStructureInput.pricingStructures.find((p) => p.id === ps.id) : null);
            this.reload(this.pricingStructure);
        }
    }
    onPricingStructureSelectionChanged($event) {
        this.pricingStructure = $event.value;
        this.reload(this.pricingStructure);
    }
    reload(pricingStructure) {
        this.pricingStructureWithItems = undefined;
        this.tablePricingStructureItemsWithPrice = [];
        this.rowInfoMap = new Map();
        if (pricingStructure && pricingStructure.id) {
            this.fetchFn(pricingStructure.id)
                .pipe(tap((p) => {
                this.pricingStructureWithItems = p;
                this.pricingStructureWithItems.items.forEach((item) => {
                    this.rowInfoMap.set(item.id, { tableItem: item, expanded: false });
                });
                this.tablePricingStructureItemsWithPrice =
                    toTablePricingStructureItemWithPrice(this.pricingStructureWithItems.items);
                console.log('****************************************xxxxx ', this.tablePricingStructureItemsWithPrice);
                setTimeout(() => {
                    this.dataSource.update([...this.tablePricingStructureItemsWithPrice]);
                });
            })).subscribe();
        }
        else {
            this.tablePricingStructureItemsWithPrice = [];
        }
    }
    onNewPricingStructure($event) {
        this.matDialog.open(PricingStructurePopupComponent, {
            width: '550px',
            data: null
        })
            .afterClosed().pipe(tap((r) => {
            if (r) {
                this.events.emit({
                    type: 'new-pricing-structure',
                    pricingStructure: r
                });
            }
        })).subscribe();
    }
    onEditPricingStructure($event, pricingStructureWithItems) {
        this.matDialog.open(PricingStructurePopupComponent, {
            width: '550px',
            data: pricingStructureWithItems
        })
            .afterClosed().pipe(tap((r) => {
            if (r) {
                this.events.emit({
                    type: 'edit-pricing-structure',
                    pricingStructure: r
                });
            }
        })).subscribe();
    }
    onDeletePricingStructure($event, pricingStructureWithItems) {
        this.events.emit({
            type: 'delete-pricing-structure',
            pricingStructure: pricingStructureWithItems
        });
    }
    onEditPricingStructureItem($event, pricingStructureItem) {
        this.matDialog.open(ItemPricePopupComponent, {
            width: '250px',
            data: pricingStructureItem
        })
            .afterClosed().pipe(tap((r) => {
            if (r) {
                this.events.emit({
                    type: 'edit-pricing-item',
                    pricingStructure: this.pricingStructure,
                    pricingStructureItem: r
                });
            }
        })).subscribe();
    }
    isRowExpanded(item) {
        if (!this.rowInfoMap.has(item.id)) {
            this.rowInfoMap.set(item.id, { expanded: false });
        }
        return this.rowInfoMap.get(item.id).expanded;
    }
    isChildRow(index, item) {
        return !!item.parentId;
    }
    isAnyParentRowExpanded(item) {
        const b = this.rowInfoMap.get(item.rootParentId);
        return b.expanded;
    }
    rowClicked(item) {
        if (!this.rowInfoMap.has(item.id)) {
            this.rowInfoMap.set(item.id, { expanded: false });
        }
        this.rowInfoMap.get(item.id).expanded = !this.rowInfoMap.get(item.id).expanded;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PricingStructureTableComponent.prototype, "pricingStructureInput", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], PricingStructureTableComponent.prototype, "fetchFn", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], PricingStructureTableComponent.prototype, "events", void 0);
PricingStructureTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-pricing-structure-table',
        templateUrl: './pricing-structure-table.component.html',
        styleUrls: ['./pricing-structure-table.component.scss'],
        animations: [
            trigger('detailExpand', [
                // state('collapsed', style({height: '0px', minHeight: '0', display: 'none', visibility: 'hidden'})),
                // state('expanded', style({height: '*',  display: 'table-row', visibility: 'visible'})),
                state('collapsed', style({ height: '0px', minHeight: '0', opacity: '0' })),
                state('expanded', style({ height: '*', opacity: '1' })),
                transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
        ],
    }),
    tslib_1.__metadata("design:paramtypes", [MatDialog])
], PricingStructureTableComponent);
export { PricingStructureTableComponent };
//# sourceMappingURL=pricing-structure-table.component.js.map