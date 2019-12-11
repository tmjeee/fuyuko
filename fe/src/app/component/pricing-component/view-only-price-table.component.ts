import {Component, Input, OnInit} from '@angular/core';
import {PriceDataImport} from '../../model/data-import.model';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {PriceDataItem} from '../../model/pricing-structure.model';


export class InternalDataSource extends DataSource<PriceDataItem> {

   subject: BehaviorSubject<PriceDataItem[]>;

   connect(collectionViewer: CollectionViewer): Observable<PriceDataItem[] | ReadonlyArray<PriceDataItem>> {
      if (!!this.subject) {
           this.subject = new BehaviorSubject<PriceDataItem[]>([]);
      }
      return this.subject.asObservable();
   }

   disconnect(collectionViewer: CollectionViewer): void {
      if (this.subject) {
         this.subject.complete();
      }
      this.subject = null;
   }

   update(priceDataImportItems: PriceDataItem[]) {
      this.subject.next(priceDataImportItems);
   }
}

@Component({
   selector: 'app-view-only-price-table' ,
   templateUrl: './view-only-price-table.component.html',
   styleUrls: ['./view-only-price-table.component.scss']
})
export class ViewOnlyPriceTableComponent implements OnInit {

   dataSource: InternalDataSource;
   @Input() priceDataImportItems: PriceDataItem[];

   constructor() {
      this.dataSource = new InternalDataSource();
   }

   ngOnInit(): void {
       this.dataSource.update(this.priceDataImportItems);
   }
}
