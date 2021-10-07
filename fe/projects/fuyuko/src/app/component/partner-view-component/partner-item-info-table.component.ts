import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {PricedItem, TablePricedItem} from '@fuyuko-common/model/item.model';

export type InternalDataSourceEntryType = {key: string, value: string | number, type: 'string' | 'number' | 'price'};

export class InternalDataSource implements DataSource<InternalDataSourceEntryType> {

   subject: BehaviorSubject<InternalDataSourceEntryType[]> = new BehaviorSubject<InternalDataSourceEntryType[]>([]);

   connect(collectionViewer: CollectionViewer): Observable<InternalDataSourceEntryType[] | ReadonlyArray<InternalDataSourceEntryType>> {
      return this.subject.asObservable();
   }

   disconnect(collectionViewer: CollectionViewer): void {
      this.subject.complete();
   }

   update(data: InternalDataSourceEntryType[]) {
      this.subject.next(data);
   }
}

@Component({
   selector: 'app-partner-item-info-table',
   templateUrl:  './partner-item-info-table.component.html',
   styleUrls: ['./partner-item-info-table.component.scss']
})
export class PartnerItemInfoTableComponent implements OnInit, OnChanges {

   @Input() tablePricedItem!: TablePricedItem | PricedItem;
   dataSource: InternalDataSource;

   constructor() {
       this.dataSource = new InternalDataSource();
   }

   ngOnInit(): void {
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.tablePricedItem) {
          const change: SimpleChange = changes.tablePricedItem;
          this.reload();
      }
   }

   reload() {
       const data: InternalDataSourceEntryType[] = [];
       data.push ({key: 'Name', value: this.tablePricedItem?.name, type: 'string'});
       data.push ({key: 'Description', value: this.tablePricedItem?.description, type: 'string'});
       data.push ({key: 'Price', value: this.tablePricedItem?.price, type: 'price'});
       data.push ({key: 'Country', value: this.tablePricedItem?.country, type: 'string'});
       this.dataSource.update(data);
   }

}
