import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs';
export class InternalDataSource extends DataSource {
    connect(collectionViewer) {
        if (!!this.subject) {
            this.subject = new BehaviorSubject([]);
        }
        return this.subject.asObservable();
    }
    disconnect(collectionViewer) {
        if (this.subject) {
            this.subject.complete();
        }
        this.subject = null;
    }
    update(pricedItems) {
        this.subject.next(pricedItems);
    }
}
let ViewOnlyPriceTableComponent = class ViewOnlyPriceTableComponent {
    constructor() {
        this.dataSource = new InternalDataSource();
    }
    ngOnInit() {
        this.dataSource.update(this.pricedItems);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], ViewOnlyPriceTableComponent.prototype, "attributes", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], ViewOnlyPriceTableComponent.prototype, "pricedItems", void 0);
ViewOnlyPriceTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-view-only-price-table',
        templateUrl: './view-only-price-table.component.html',
        styleUrls: ['./view-only-price-table.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [])
], ViewOnlyPriceTableComponent);
export { ViewOnlyPriceTableComponent };
//# sourceMappingURL=view-only-price-table.component.js.map