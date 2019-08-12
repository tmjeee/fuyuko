import {Component, Input, OnInit} from '@angular/core';
import {BulkEditTableItem} from '../../model/bulk-edit.model';
import {Attribute} from '../../model/attribute.model';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';

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
    @Input() whenAttribtues: Attribute[];
    @Input() bulkEditTableItem: BulkEditTableItem[];
    displayedColumns: string[];
    datasource: BulkEditReviewTableDataSource;

    constructor() {
        this.displayedColumns = [];
        this.datasource = new BulkEditReviewTableDataSource();
    }

    ngOnInit(): void {
        this.displayedColumns = [
            ...this.whenAttribtues.map((wa: Attribute) => '' + wa.id),
        ];
        this.changeAttributes.forEach((ca: Attribute) => {
            this.displayedColumns.push(`old-${ca.id}`);
            this.displayedColumns.push(`new-${ca.id}`);
        });
        this.datasource.update(this.bulkEditTableItem);
    }



}
