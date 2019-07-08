import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemAndAttributeSet} from '../../model/item-attribute.model';
import {SearchType} from '../../component/item-search-component/item-search.component';
import {View} from '../../model/view.model';
import {Subscription, combineLatest} from 'rxjs';
import {DataListComponentEvent, DataListSearchComponentEvent} from '../../component/data-list-component/data-list.component';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ViewService} from '../../service/view-service/view.service';
import {ItemService} from '../../service/item-service/item.service';
import {Item} from '../../model/item.model';
import {map} from 'rxjs/operators';
import {Attribute} from '../../model/attribute.model';


@Component({
  templateUrl: './view-data-list.page.html',
  styleUrls: ['./view-data-list.page.scss']
})
export class ViewDataListPageComponent implements OnInit, OnDestroy {

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

  onDataListSearchEvent($event: DataListSearchComponentEvent) {
    this.search = $event.search;
    this.searchType = $event.type;
    this.reload();
  }

  onDataListEvent($event: DataListComponentEvent) {
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
}
