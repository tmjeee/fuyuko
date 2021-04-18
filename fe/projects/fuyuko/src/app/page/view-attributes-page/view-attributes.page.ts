import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ViewService} from '../../service/view-service/view.service';
import {finalize, map} from 'rxjs/operators';
import {View} from '@fuyuko-common/model/view.model';
import {Subscription} from 'rxjs';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {AttributeTableComponentEvent} from '../../component/attribute-table-component/attribute-table.component';
import {NotificationsService} from 'angular2-notifications';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {Router} from '@angular/router';
import {Pagination} from '../../utils/pagination.utils';
import {PaginationComponentEvent} from '../../component/pagination-component/pagination.component';

@Injectable()
export class Prov {

}

@Component({
  templateUrl: './view-attributes.page.html',
  styleUrls: ['./view-attributes.page.scss'],
  providers: [Prov]
})
export class ViewAttributesPageComponent implements OnInit, OnDestroy {

  pagination: Pagination;

  subscription: Subscription;

  viewReady: boolean;
  attributesReady: boolean;

  currentView: View;
  attributes: Attribute[];

  constructor(private attributeService: AttributeService,
              private router: Router,
              private notificationsService: NotificationsService,
              private viewService: ViewService) {
      this.pagination = new Pagination();
  }

  ngOnInit(): void {
    this.viewReady = false;
    this.subscription = this.viewService
      .asObserver()
      .pipe(
        map((v: View) => {
          if (v) {
            this.currentView = v;
            this.reload();
            this.viewReady = true;
          }
        })
      ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  reload() {
    if (this.currentView) {
      this.attributesReady = false;
      this.attributeService.getAllAttributesByView(this.currentView.id, this.pagination.limitOffset())
        .pipe(
          map((r: PaginableApiResponse<Attribute[]>) => {
            this.attributes = r.payload;
            this.pagination.update(r);
          }),
          finalize(() => {
              this.attributesReady = true;
          })
        ).subscribe();
    }
  }

  async onAttributeTableEvent($event: AttributeTableComponentEvent) {
    switch ($event.type) {
      case 'delete':
        this.attributeService
          .deleteAttribute($event.view, $event.attribute)
          .pipe(
            map((a: ApiResponse) => {
              toNotifications(this.notificationsService, a);
              this.reload();
            })
          ).subscribe();
        break;
      case 'search':
        this.attributeService.searchAttribute($event.view.id, $event.search)
          .pipe(
            map((a: Attribute[]) => {
              this.attributes = a;
            })
          ).subscribe();
        break;
      case 'add':
          await this.router.navigate(['/view-layout',
              {outlets: {primary: ['add-attribute'], help: ['view-help']}}]);
          break;
      case 'edit':
        await this.router.navigate(['/view-layout',
              {outlets: {primary: ['edit-attribute', `${$event.attribute.id}`], help: ['view-help']}}]);
        break;
    }
  }

    onPaginationEvent($event: PaginationComponentEvent) {
      this.pagination.updateFromPageEvent($event.pageEvent);
      this.reload();
    }
}
