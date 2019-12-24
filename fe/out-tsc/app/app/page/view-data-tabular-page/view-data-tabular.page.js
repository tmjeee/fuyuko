import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AttributeService } from '../../service/attribute-service/attribute.service';
import { ItemService } from '../../service/item-service/item.service';
import { combineLatest, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ViewService } from '../../service/view-service/view.service';
import { toTableItem } from '../../utils/item-to-table-items.util';
import { toNotifications } from '../../service/common.service';
import { NotificationsService } from 'angular2-notifications';
let ViewDataTabularPageComponent = class ViewDataTabularPageComponent {
    constructor(attributeService, notificationService, viewService, itemService) {
        this.attributeService = attributeService;
        this.notificationService = notificationService;
        this.viewService = viewService;
        this.itemService = itemService;
    }
    ngOnInit() {
        this.search = '';
        this.searchType = 'basic';
        this.subscription = this.viewService.asObserver().subscribe((currentView) => {
            this.currentView = currentView;
            if (this.currentView) {
                this.reload();
            }
            else {
                this.done = true;
            }
        });
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    reload() {
        this.done = false;
        const viewId = this.currentView.id;
        combineLatest([
            this.attributeService.getAllAttributesByView(viewId),
            this.itemService.getAllItems(viewId)
        ]).pipe(map((r) => {
            const attributes = r[0];
            const items = r[1];
            const tableItems = toTableItem(items);
            this.itemAndAttributeSet = {
                attributes,
                tableItems,
            };
            this.done = true;
        })).subscribe();
    }
    onDataTableEvent($event) {
        switch ($event.type) {
            case 'modification':
                forkJoin([
                    this.itemService.deleteTableItems(this.currentView.id, $event.deletedItems),
                    this.itemService.saveTableItems(this.currentView.id, $event.modifiedItems)
                ]).pipe(tap((r) => {
                    toNotifications(this.notificationService, r[0]);
                    toNotifications(this.notificationService, r[1]);
                    this.reload();
                })).subscribe();
                break;
            case 'reload':
                this.reload();
                break;
        }
    }
    onDataTableSearchEvent($event) {
        this.search = $event.search;
        this.searchType = $event.type;
        this.reload();
    }
};
ViewDataTabularPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './view-data-tabular.page.html',
        styleUrls: ['./view-data-tabular.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [AttributeService,
        NotificationsService,
        ViewService,
        ItemService])
], ViewDataTabularPageComponent);
export { ViewDataTabularPageComponent };
//# sourceMappingURL=view-data-tabular.page.js.map