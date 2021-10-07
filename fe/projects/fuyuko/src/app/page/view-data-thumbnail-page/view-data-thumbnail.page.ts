import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemAndAttributeSet} from '@fuyuko-common/model/item-attribute.model';
import {View} from '@fuyuko-common/model/view.model';
import {combineLatest, Subscription} from 'rxjs';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {NotificationsService} from 'angular2-notifications';
import {ViewService} from '../../service/view-service/view.service';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {finalize, map, tap} from 'rxjs/operators';
import {Item, ItemSearchType} from '@fuyuko-common/model/item.model';
import {ItemService} from '../../service/item-service/item.service';
import {
  DataThumbnailComponentEvent,
  DataThumbnailSearchComponentEvent
} from '../../component/data-thumbnail-component/data-thumbnail.component';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {CarouselComponentEvent} from '../../component/carousel-component/carousel.component';
import {Pagination} from '../../utils/pagination.utils';
import {PaginationComponentEvent} from '../../component/pagination-component/pagination.component';
import {LoadingService} from '../../service/loading-service/loading.service';
import {FormBuilder, FormControl} from '@angular/forms';
import {AuthService} from '../../service/auth-service/auth.service';
import {assertDefinedReturn} from '../../utils/common.util';

export type DataListTypes = 'ALL' | 'FAVOURITE';

@Component({
  templateUrl: './view-data-thumbnail.page.html',
  styleUrls: ['./view-data-thumbnail.page.scss']
})
export class ViewDataThumbnailPageComponent implements OnInit, OnDestroy {


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
              private viewService: ViewService,
              private authService: AuthService,
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
              this.itemService.searchForItems(viewId, this.searchType, this.search, this.pagination.limitOffset()) :
              this.itemService.searchForFavouriteItems(viewId, userId, this.searchType, this.search, this.pagination.limitOffset()))

          :

          // non-search
          (this.formControlDataListTypes.value === 'ALL' ?
            this.itemService.getAllItems(viewId, this.pagination.limitOffset()) :
            this.itemService.getFavouriteItems(viewId, userId, this.pagination.limitOffset()))
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


  onDataThumbnailEvent($event: DataThumbnailComponentEvent) {
    switch ($event.type) {
      case 'modification':
        combineLatest([
          this.itemService.saveItems(assertDefinedReturn(this.currentView).id, $event.modifiedItems),
          this.itemService.deleteItems(assertDefinedReturn(this.currentView).id, $event.deletedItems)
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

  onDataThumbnailSearchEvent($event: DataThumbnailSearchComponentEvent) {
    this.search = $event.search;
    this.searchType = $event.type;
    this.reload();
  }

  onCarouselEvent($event: CarouselComponentEvent) {
    switch ($event.type) {
      case 'delete': {
        if ($event.image) {
          this.itemService.deleteItemImage($event.itemId, $event.image.id).pipe(
              tap((r: ApiResponse) => {
                toNotifications(this.notificationService, r);
                this.reload();
              })
          ).subscribe();
        }
        break;
      }
      case 'markAsPrimary': {
        if ($event.image) {
          this.itemService.markItemImageAsPrimary($event.itemId, $event.image.id).pipe(
              tap((r: ApiResponse) => {
                toNotifications(this.notificationService, r);
                this.reload();
              })
          ).subscribe();
        }
        break;
      }
      case 'upload': {
        if ($event.file) {
          this.itemService.uploadItemImage($event.itemId, $event.file).pipe(
              tap((r: ApiResponse) => {
                toNotifications(this.notificationService, r);
                this.reload();
              })
          ).subscribe();
        }
        break;
      }
    }
  }

  onPaginationEvent($event: PaginationComponentEvent) {
    this.pagination.updateFromPageEvent($event.pageEvent);
    this.reload();
  }
}
