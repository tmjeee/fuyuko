import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs';
export class BulkEditReviewTableDataSource extends DataSource {
    constructor() {
        super(...arguments);
        this.subject = new BehaviorSubject([]);
    }
    connect(collectionViewer) {
        return this.subject.asObservable();
    }
    disconnect(collectionViewer) {
        this.subject.complete();
    }
    update(bulkEditTableItem) {
        if (bulkEditTableItem) {
            this.subject.next(bulkEditTableItem);
        }
    }
}
let BulkEditReviewTableComponent = class BulkEditReviewTableComponent {
    constructor() {
        this.displayedColumns = [];
        this.attributeHeaderColumns = [];
        this.changeOldNewValuesHeaderColumns = [];
        this.dataSource = new BulkEditReviewTableDataSource();
    }
    ngOnInit() {
        this.attributeHeaderColumns = [
            'item-info-header',
            ...this.whenAttributes.map((wa) => `when-attributes-header-${wa.id}`),
            ...this.changeAttributes.map((ca) => `change-attributes-header-${ca.id}`)
        ];
        this.changeAttributes.forEach((ca) => {
            this.changeOldNewValuesHeaderColumns.push(`change-old-values-header-${ca.id}`);
            this.changeOldNewValuesHeaderColumns.push(`change-new-values-header-${ca.id}`);
        });
        this.displayedColumns = [
            `item-info-cell`,
            ...this.whenAttributes.map((wa) => '' + wa.id),
        ];
        this.changeAttributes.forEach((ca) => {
            this.displayedColumns.push(`old-${ca.id}`);
            this.displayedColumns.push(`new-${ca.id}`);
        });
        this.dataSource.update(this.bulkEditTableItem);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], BulkEditReviewTableComponent.prototype, "changeAttributes", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], BulkEditReviewTableComponent.prototype, "whenAttributes", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], BulkEditReviewTableComponent.prototype, "bulkEditTableItem", void 0);
BulkEditReviewTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-bulk-edit-review-table',
        templateUrl: './bulk-edit-review-table.component.html',
        styleUrls: ['./bulk-edit-review-table.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [])
], BulkEditReviewTableComponent);
export { BulkEditReviewTableComponent };
//# sourceMappingURL=bulk-edit-review-table.component.js.map