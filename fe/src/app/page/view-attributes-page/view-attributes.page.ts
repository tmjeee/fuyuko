import {Component, OnDestroy, OnInit} from '@angular/core';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ViewService} from '../../service/view-service/view.service';
import {map} from 'rxjs/operators';
import {View} from '../../model/view.model';
import {Subscription} from 'rxjs';
import {Attribute} from '../../model/attribute.model';
import {AttributeTableComponentEvent} from '../../component/attribute-table-component/attribute-table.component';
import {NotificationsService} from 'angular2-notifications';

@Component({
  templateUrl: './view-attributes.page.html',
  styleUrls: ['./view-attributes.page.scss']
})
export class ViewAttributesPageComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  currentView: View;
  attributes: Attribute[];

  constructor(private attributeService: AttributeService,
              private notificationsService: NotificationsService,
              private viewService: ViewService) {}

  ngOnInit(): void {
    this.subscription = this.viewService
      .asObserver()
      .pipe(
        map((v: View) => {
          if (v) {
            this.currentView = v;
            this.reloadAttributes();
          }
        })
      ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  reloadAttributes() {
    if (this.currentView) {
      this.attributeService.getAllAttributesByView(this.currentView.id)
        .pipe(
          map((a: Attribute[]) => {
            this.attributes = a;
          })
        ).subscribe();
    }
  }

  onAttributeTableEvent($event: AttributeTableComponentEvent) {
    switch ($event.type) {
      case 'delete':
        this.attributeService
          .deleteAttribute($event.view, $event.attribute)
          .pipe(
            map((a: Attribute) => {
              this.notificationsService.success('Success', 'Attribute deleted');
              this.reloadAttributes();
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
        this.attributeService.addAttribute($event.view, $event.attribute)
          .pipe(
            map((a: Attribute) => {
              this.notificationsService.success('Success', 'Attribute added');
              this.reloadAttributes();
            })
          ).subscribe();
        break;
      case 'edit':
        this.attributeService.updateAttribute($event.view, $event.attribute)
          .pipe(
            map((a: Attribute) => {
              this.notificationsService.success('Success', 'Attribute updated');
              this.reloadAttributes();
            })
          ).subscribe();
        break;
    }
  }
}
