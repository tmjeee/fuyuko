import {Component, Input, OnInit} from '@angular/core';
import {PriceDataImport} from '../../model/data-import.model';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {PriceDataItem} from '../../model/pricing-structure.model';
import {Attribute} from '../../model/attribute.model';
import {Item, PricedItem} from '../../model/item.model';


export class InternalDataSource extends DataSource<PricedItem> {

   subject: BehaviorSubject<PricedItem[]>;

   connect(collectionViewer: CollectionViewer): Observable<PricedItem[] | ReadonlyArray<PricedItem>> {
      if (!!this.subject) {
           this.subject = new BehaviorSubject<PricedItem[]>([]);
      }
      return this.subject.asObservable();
   }

   disconnect(collectionViewer: CollectionViewer): void {
      if (this.subject) {
         this.subject.complete();
      }
      this.subject = null;
   }

   update(pricedItems: PricedItem[]) {
      this.subject.next(pricedItems);
   }
}

@Component({
   selector: 'app-view-only-price-table' ,
   templateUrl: './view-only-price-table.component.html',
   styleUrls: ['./view-only-price-table.component.scss']
})
export class ViewOnlyPriceTableComponent implements OnInit {

   @Input() attributes: Attribute[];
   @Input() pricedItems: PricedItem[];

   dataSource: InternalDataSource;

   constructor() {
      this.dataSource = new InternalDataSource();
   }

   ngOnInit(): void {
       this.dataSource.update(this.pricedItems);
   }
}
