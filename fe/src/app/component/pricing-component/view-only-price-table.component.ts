import {Component, Input, OnInit} from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {Attribute} from '../../model/attribute.model';
import {PricedItem} from '../../model/item.model';


export class InternalDataSource extends DataSource<PricedItem> {

   subject: BehaviorSubject<PricedItem[]>;

   connect(collectionViewer: CollectionViewer): Observable<PricedItem[] | ReadonlyArray<PricedItem>> {
      if (!this.subject) {
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

   update(priceDataItems: PricedItem[]) {
      if (!this.subject) {
         this.subject = new BehaviorSubject<PricedItem[]>([]);
      }
      this.subject.next(priceDataItems);
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
   displayedColumns: string[];

   constructor() {
      this.displayedColumns = ['pricingStructureName', 'itemName', 'price', 'country']
      this.dataSource = new InternalDataSource();
   }

   ngOnInit(): void {
       this.dataSource.update(this.pricedItems);
   }
}
