import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemAndAttributeSet} from '@fuyuko-common/model/item-attribute.model';
import {View} from '@fuyuko-common/model/view.model';
import {Subscription, combineLatest} from 'rxjs';
import {DataListComponentEvent, DataListSearchComponentEvent} from '../../component/data-list-component/data-list.component';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ViewService} from '../../service/view-service/view.service';
import {ItemService} from '../../service/item-service/item.service';
import {Item, ItemSearchType} from '@fuyuko-common/model/item.model';
import {finalize, map, tap} from 'rxjs/operators';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {NotificationsService} from 'angular2-notifications';
import {Pagination} from '../../utils/pagination.utils';
import {PaginationComponentEvent} from '../../component/pagination-component/pagination.component';
import {LoadingService} from '../../service/loading-service/loading.service';
import {FormBuilder, FormControl} from '@angular/forms';
import {AuthService} from '../../service/auth-service/auth.service';
import {assertDefinedReturn} from '../../utils/common.util';

export type DataListTypes = 'ALL' | 'FAVOURITE';

@Component({
  templateUrl: './view-data-list.page.html',
  styleUrls: ['./view-data-list.page.scss']
})
export class ViewDataListPageComponent implements OnInit, OnDestroy {

  itemAndAttributeSet?: ItemAndAttributeSet;
  favouritedItemIds: number[] = [];
  done = false;

  search!: string;
  searchType!: ItemSearchType;
  currentView?: View;
  subscription?: Subscription;

  pagination: Pagination;
  formControlDataListTypes: FormControl;

  constructor(private attributeService: AttributeService,
              private notificationService: NotificationsService,
              private authService: AuthService,
              private viewService: ViewService,
              private itemService: ItemService,
              private loadingService: LoadingService,
              private formBuilder: FormBuilder) {
      this.pagination = new Pagination();
      this.formControlDataListTypes = formBuilder.control('ALL', []);
  }


  ngOnInit(): void {
    this.search = '';
    this.searchType = 'basic';
    this.subscription = this.viewService.asObserver().subscribe((currentView: View | undefined) => {
      this.currentView = currentView;
      if (this.currentView) {
        this.reload();
      } else {
        this.done = true;
      }
    });
    this.formControlDataListTypes.valueChanges.pipe(
        tap((v: string) => {
          this.reload();
        })
    ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  reload() {
    this.done = false;
    this.loadingService.startLoading();
    const viewId = assertDefinedReturn(this.currentView).id;
    const userId = assertDefinedReturn(this.authService.myself()).id;
    combineLatest([
        this.attributeService.getAllAttributesByView(viewId)
            .pipe(map((r: PaginableApiResponse<Attribute[]>) => r.payload)),
        (this.search && this.searchType) ?
            // search
            (this.formControlDataListTypes.value === 'ALL' ?
              // search for all items
              this.itemService.searchForItems(viewId, this.searchType, this.search, this.pagination.limitOffset()) :
              // search for favourite items
              this.itemService.searchForFavouriteItems(viewId, userId, this.searchType,
                  this.search, this.pagination.limitOffset()))
            :

            // non-search
            (this.formControlDataListTypes.value === 'ALL' ?
              this.itemService.getAllItems(viewId, this.pagination.limitOffset()) :  // get all items
              this.itemService.getFavouriteItems(viewId, userId, this.pagination.limitOffset()))  // get favourite items
        ,
        // favourite item ids
        this.itemService.getFavouriteItemIds(viewId, userId)
    ]).pipe(
        map( (r: [Attribute[] | undefined, PaginableApiResponse<Item[]>, number[]]) => {
          const attributes: Attribute[] | undefined = r[0];
          const items: Item[] | undefined = r[1].payload;
          this.pagination.update(r[1]);
          this.itemAndAttributeSet = {
            attributes: attributes ?? [],
            items: items ?? [],
          };
          this.favouritedItemIds = r[2];
          this.done = true;
        }),
        finalize(() => {
          this.done = true;
          this.loadingService.stopLoading();
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
        if (this.currentView) {
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
        }
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
