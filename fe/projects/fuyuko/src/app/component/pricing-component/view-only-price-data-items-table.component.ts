import {Component, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {PriceDataItem} from '@fuyuko-common/model/pricing-structure.model';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';

export class InternalDataSource extends DataSource<PriceDataItem> {

    subject?: BehaviorSubject<PriceDataItem[]>;

    connect(collectionViewer: CollectionViewer): Observable<PriceDataItem[] | ReadonlyArray<PriceDataItem>> {
        if (!this.subject) {
            this.subject = new BehaviorSubject<PriceDataItem[]>([]);
        }
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        if (this.subject) {
            this.subject.complete();
        }
        this.subject = undefined;
    }

    update(priceDataItems: PriceDataItem[]) {
        if (!this.subject) {
            this.subject = new BehaviorSubject<PriceDataItem[]>([]);
        }
        this.subject.next(priceDataItems);
    }
}



@Component({
    selector: 'app-view-only-price-data-items-table',
    templateUrl: './view-only-price-data-items-table.component.html',
    styleUrls: ['./view-only-price-data-items-table.component.scss']
})
export class ViewOnlyPriceDataItemsTableComponent implements OnChanges {

    @Input() attributes: Attribute[] = [];
    @Input() priceDataItems: PriceDataItem[] = [];

    dataSource: InternalDataSource;
    displayedColumns: string[];

    constructor() {
        this.displayedColumns = ['pricingStructureName', 'viewName', 'itemName', 'price', 'country'];
        this.dataSource = new InternalDataSource();
    }

    ngOnInit(): void {
        this.dataSource.update(this.priceDataItems);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const simpleChange: SimpleChange = changes.priceDataItems;
        if (simpleChange && simpleChange.currentValue) {
            this.dataSource.update(simpleChange.currentValue);
        }
    }
}
