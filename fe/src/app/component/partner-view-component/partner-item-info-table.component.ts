import {Component, Input, OnInit} from "@angular/core";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable} from "rxjs";
import {TablePricedItem} from "../../model/item.model";

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
export class PartnerItemInfoTableComponent implements OnInit {

   @Input() tablePricedItem: TablePricedItem;
   dataSource: InternalDataSource;

   constructor() {
       this.dataSource = new InternalDataSource();
   }

   ngOnInit(): void {
       const data: InternalDataSourceEntryType[] = [];
       data.push ({key: 'Name', value: this.tablePricedItem?.name, type: 'string'});
       data.push ({key: 'Description', value: this.tablePricedItem?.description, type: 'string'});
       data.push ({key: 'Price', value: this.tablePricedItem?.price, type: 'price'});
       data.push ({key: 'Country', value: this.tablePricedItem?.country, type: 'string'});
       this.dataSource.update(data);
   }

}