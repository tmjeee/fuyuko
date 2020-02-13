import {Component, OnDestroy, OnInit} from '@angular/core';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ItemService} from '../../service/item-service/item.service';
import {combineLatest, forkJoin, Subscription} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Item, ItemSearchType, TableItem} from '../../model/item.model';
import {Attribute} from '../../model/attribute.model';
import {TableItemAndAttributeSet} from '../../model/item-attribute.model';
import {ViewService} from '../../service/view-service/view.service';
import {View} from '../../model/view.model';
import {DataTableComponentEvent} from '../../component/data-table-component/data-table.component';
import {toTableItem} from '../../utils/item-to-table-items.util';
import {ItemSearchComponentEvent} from '../../component/item-search-component/item-search.component';
import {ApiResponse} from '../../model/response.model';
import {toNotifications} from '../../service/common.service';
import {NotificationsService} from 'angular2-notifications';


@Component({
  templateUrl: './view-data-tabular.page.html',
  styleUrls: ['./view-data-tabular.page.scss']
})
export class ViewDataTabularPageComponent implements OnInit, OnDestroy {

  itemAndAttributeSet: TableItemAndAttributeSet;
  done: boolean;


  search: string;
  searchType: ItemSearchType;
  currentView: View;
  subscription: Subscription;

  constructor(private attributeService: AttributeService,
              private notificationService: NotificationsService,
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
      } else {
        this.done = true;
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
    combineLatest([
      this.attributeService.getAllAttributesByView(viewId),
      (this.search && this.searchType) ?
          this.itemService.searchForItems(viewId, this.searchType, this.search) :
          this.itemService.getAllItems(viewId)
    ]).pipe(
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
        forkJoin([
          this.itemService.deleteTableItems(this.currentView.id, $event.deletedItems),
          this.itemService.saveTableItems(this.currentView.id, $event.modifiedItems)
        ]).pipe(
          tap((r: [ApiResponse, ApiResponse]) => {
            toNotifications(this.notificationService, r[0]);
            toNotifications(this.notificationService, r[1]);
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
