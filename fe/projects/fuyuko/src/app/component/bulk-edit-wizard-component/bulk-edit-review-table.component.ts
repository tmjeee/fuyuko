import {Component, Input, OnInit} from '@angular/core';
import {BulkEditTableItem} from '@fuyuko-common/model/bulk-edit.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import uuid from 'uuid';

export class BulkEditReviewTableDataSource extends DataSource<BulkEditTableItem> {
    private subject: BehaviorSubject<BulkEditTableItem[]> = new BehaviorSubject([]);
    connect(collectionViewer: CollectionViewer): Observable<BulkEditTableItem[] | ReadonlyArray<BulkEditTableItem>> {
        return this.subject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(bulkEditTableItem: BulkEditTableItem[]) {
        if (bulkEditTableItem) {
            this.subject.next(bulkEditTableItem);
        }
    }
}


@Component({
    selector: 'app-bulk-edit-review-table',
    templateUrl: './bulk-edit-review-table.component.html',
    styleUrls: ['./bulk-edit-review-table.component.scss']
})
export class BulkEditReviewTableComponent implements OnInit {

    @Input() changeAttributes: Attribute[];
    @Input() whenAttributes: Attribute[];
    @Input() bulkEditTableItem: BulkEditTableItem[];
    attributeHeaderColumns: string[];
    changeOldNewValuesHeaderColumns: string[];
    displayedColumns: string[];
    dataSource: BulkEditReviewTableDataSource;

    constructor() {
        this.displayedColumns = [];
        this.attributeHeaderColumns = [];
        this.changeOldNewValuesHeaderColumns = [];
        this.dataSource = new BulkEditReviewTableDataSource();
    }

    ngOnInit(): void {
        this.whenAttributes.forEach((a: Attribute) => (a as any).uid = uuid());
        this.changeAttributes.forEach((a: Attribute) => (a as any).uid = uuid());

        this.attributeHeaderColumns = [
            'item-number-header',
            'item-info-header',
            ...this.whenAttributes.map((wa: Attribute) => `when-attributes-header-${(wa as any).uid}-${wa.id}`),
            ...this.changeAttributes.map((ca: Attribute) => `change-attributes-header-${(ca as any).uid}-${ca.id}`),
        ];
        this.changeAttributes.forEach((ca: Attribute) => {
            this.changeOldNewValuesHeaderColumns.push(`change-old-values-header-${(ca as any).uid}-${ca.id}`);
            this.changeOldNewValuesHeaderColumns.push(`change-new-values-header-${(ca as any).uid}-${ca.id}`);
        });
        this.displayedColumns = [
            `item-number-cell`,
            `item-info-cell`,
            ...this.whenAttributes.map((wa: Attribute) => `${(wa as any).uid}-${wa.id}`),
        ];
        this.changeAttributes.forEach((ca: Attribute) => {
            this.displayedColumns.push(`old-${(ca as any).uid}-${(ca as any).id}`);
            this.displayedColumns.push(`new-${(ca as any).uid}-${(ca as any).id}`);
        });
        this.dataSource.update(this.bulkEditTableItem);
    }

    propValueInAttribute(att: Attribute, propName: string): any {
        return (att as any)[propName];
    }
}
