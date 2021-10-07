import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {PricedItem, TablePricedItem} from '@fuyuko-common/model/item.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {Attribute} from '@fuyuko-common/model/attribute.model';

export interface ItemAndAttribute {
    attribute: Attribute;
    item: PricedItem | TablePricedItem;
}

export class DataTableDataSource extends DataSource<ItemAndAttribute> {

    subject: BehaviorSubject<ItemAndAttribute[]> = new BehaviorSubject([] as ItemAndAttribute[]);

    connect(collectionViewer: CollectionViewer): Observable<ItemAndAttribute[]> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(itemAndAttributes: ItemAndAttribute[]) {
        this.subject.next(itemAndAttributes);
    }
}



@Component({
    selector: 'app-partner-attribute-table',
    templateUrl: './partner-attribute-table.component.html',
    styleUrls: ['./partner-attribute-table.component.scss']
})
export class PartnerAttributeTableComponent implements OnInit, OnChanges {

    @Input() item!: PricedItem | TablePricedItem;
    @Input() attributes: Attribute[] = [];

    dataSource = new DataTableDataSource();
    itemAndAttributes: ItemAndAttribute[] = [];

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.item && changes.item.currentValue) {
           this.update();
        }
    }

    update() {
        this.itemAndAttributes = [];
        for (const attribute of this.attributes) {
            this.itemAndAttributes.push({
                item: this.item,
                attribute
            } as ItemAndAttribute);
        }
        this.dataSource.update(this.itemAndAttributes);
    }
}
