import {Component, OnDestroy, OnInit} from '@angular/core';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ItemService} from '../../service/item-service/item.service';
import {combineLatest, forkJoin, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Item, TableItem} from '../../model/item.model';
import {Attribute} from '../../model/attribute.model';
import {TableItemAndAttributeSet} from '../../model/item-attribute.model';
import {ViewService} from '../../service/view-service/view.service';
import {View} from '../../model/view.model';
import {DataTableComponentEvent} from '../../component/data-table-component/data-table.component';
import {toTableItem} from '../../utils/item-to-table-items.util';
import {ItemSearchComponentEvent, SearchType} from '../../component/item-search-component/item-search.component';


@Component({
  templateUrl: './view-data-tabular.page.html',
  styleUrls: ['./view-data-tabular.page.scss']
})
export class ViewDataTabularPageComponent implements OnInit, OnDestroy {

  itemAndAttributeSet: TableItemAndAttributeSet;
  done: boolean;


  search: string;
  searchType: SearchType;
  currentView: View;
  subscription: Subscription;

  constructor(private attributeService: AttributeService,
              private viewService: ViewService,
              private itemService: ItemService) {
  }

  ngOnInit(): void {
    this.search = '';
    this.searchType = 'basic';
    this.subscription = this.viewService.asObserver().subscribe((currentView: View) => {
      this.currentView = currentView;
      if (this.currentView) {
        this.reload();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  reload() {
    this.done = false;
    const viewId = this.currentView.id;
    combineLatest(
      this.attributeService.getAllAttributesByView(viewId),
      this.itemService.getAllItems(viewId)
    ).pipe(
      map( (r: [Attribute[], Item[]]) => {
       const attributes: Attribute[] = r[0];
       const items: Item[] = r[1];
       const tableItems: TableItem[] = toTableItem(items);
       this.itemAndAttributeSet = {
         attributes,
         tableItems,
       };
       this.done = true;
      })
    ).subscribe();
  }


  onDataTableEvent($event: DataTableComponentEvent) {
    switch ($event.type) {
      case 'modification':
        forkJoin(
          this.itemService.deleteTableItems($event.deletedItems),
          this.itemService.saveTableItems($event.modifiedItems)
        ).pipe(
          map((r: [Item[], Item[]]) => {
            const deletedItems: Item[] = r[0];
            const savedItems: Item[] = r[1];
            this.reload();
          })
        ).subscribe();
        break;
      case 'reload':
        this.reload();
        break;
    }
  }

  onDataTableSearchEvent($event: ItemSearchComponentEvent) {
    this.search = $event.search;
    this.searchType = $event.type;
    this.reload();
  }
}
