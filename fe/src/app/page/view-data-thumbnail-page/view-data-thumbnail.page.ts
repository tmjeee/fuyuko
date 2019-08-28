import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemAndAttributeSet, TableItemAndAttributeSet} from '../../model/item-attribute.model';
import {SearchType} from '../../component/item-search-component/item-search.component';
import {View} from '../../model/view.model';
import {combineLatest, forkJoin, Subscription} from 'rxjs';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {NotificationsService} from 'angular2-notifications';
import {ViewService} from '../../service/view-service/view.service';
import {Attribute} from '../../model/attribute.model';
import {map} from 'rxjs/operators';
import {Item, TableItem} from '../../model/item.model';
import {ItemService} from '../../service/item-service/item.service';
import {
  DataThumbnailComponentEvent,
  DataThumbnailSearchComponentEvent
} from '../../component/data-thumbnail-component/data-thumbnail.component';


@Component({
  templateUrl: './view-data-thumbnail.page.html',
  styleUrls: ['./view-data-thumbnail.page.scss']
})
export class ViewDataThumbnailPageComponent implements OnInit, OnDestroy {


  itemAndAttributeSet: ItemAndAttributeSet;
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
        this.itemAndAttributeSet = {
          attributes,
          items,
        };
        this.done = true;
      })
    ).subscribe();
  }


  onDataThumbnailEvent($event: DataThumbnailComponentEvent) {
    switch ($event.type) {
      case 'modification':
        combineLatest([
          this.itemService.saveItems($event.modifiedItems),
          this.itemService.deleteItems($event.deletedItems)
        ]).subscribe((r: [Item[], Item[]]) => {
            const modifiedItems: Item[] = r[0];
            const deletedItems: Item[] = r[1];
            this.reload();
        });
        break;
      case 'reload':
        console.log('data thumbnail reload');
        this.reload();
        break;
    }
  }

  onDataThumbnailSearchEvent($event: DataThumbnailSearchComponentEvent) {
    this.search = $event.search;
    this.searchType = $event.type;
    this.reload();
  }
}
