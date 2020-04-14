import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemAndAttributeSet} from '../../model/item-attribute.model';
import {View} from '../../model/view.model';
import {Subscription, combineLatest} from 'rxjs';
import {DataListComponentEvent, DataListSearchComponentEvent} from '../../component/data-list-component/data-list.component';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ViewService} from '../../service/view-service/view.service';
import {ItemService} from '../../service/item-service/item.service';
import {Item, ItemSearchType} from '../../model/item.model';
import {map} from 'rxjs/operators';
import {Attribute} from '../../model/attribute.model';
import {ApiResponse, PaginableApiResponse} from '../../model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {NotificationsService} from 'angular2-notifications';
import {Pagination} from "../../utils/pagination.utils";
import {PaginationComponentEvent} from "../../component/pagination-component/pagination.component";


@Component({
  templateUrl: './view-data-list.page.html',
  styleUrls: ['./view-data-list.page.scss']
})
export class ViewDataListPageComponent implements OnInit, OnDestroy {

  itemAndAttributeSet: ItemAndAttributeSet;
  done: boolean;

  search: string;
  searchType: ItemSearchType;
  currentView: View;
  subscription: Subscription;

  pagination: Pagination;

  constructor(private attributeService: AttributeService,
              private notificationService: NotificationsService,
              private viewService: ViewService,
              private itemService: ItemService) {
      this.pagination = new Pagination();
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
        this.attributeService.getAllAttributesByView(viewId)
            .pipe(map((r: PaginableApiResponse<Attribute[]>) => r.payload)),
        (this.search && this.searchType) ?
            this.itemService.searchForItems(viewId, this.searchType, this.search) :
            this.itemService.getAllItems(viewId, this.pagination.limitOffset())
    ]).pipe(
        map( (r: [Attribute[], PaginableApiResponse<Item[]>]) => {
          const attributes: Attribute[] = r[0];
          const items: Item[] = r[1].payload;
          this.pagination.update(r[1]);
          this.itemAndAttributeSet = {
            attributes,
            items,
          };
          this.done = true;
        })
    ).subscribe();
  }

  onDataListSearchEvent($event: DataListSearchComponentEvent) {
    this.search = $event.search;
    this.searchType = $event.type;
    this.reload();
  }

  onDataListEvent($event: DataListComponentEvent) {
    switch ($event.type) {
      case 'modification':
        combineLatest([
          this.itemService.saveItems(this.currentView.id, $event.modifiedItems),
          this.itemService.deleteItems(this.currentView.id, $event.deletedItems)
        ]).subscribe((r: [ApiResponse, ApiResponse]) => {
          if ($event.modifiedItems.length) {
            toNotifications(this.notificationService, r[0]);
          }
          if ($event.deletedItems.length) {
            toNotifications(this.notificationService, r[1]);
          }
          this.reload();
        });
        break;
      case 'reload':
        this.reload();
        break;
    }
  }

  onPaginationEvent($event: PaginationComponentEvent) {
    this.pagination.updateFromPageEvent($event.pageEvent);
    this.reload();
  }
}
