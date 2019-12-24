import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { AttributeService } from '../../service/attribute-service/attribute.service';
import { NotificationsService } from 'angular2-notifications';
import { ViewService } from '../../service/view-service/view.service';
import { map } from 'rxjs/operators';
import { ItemService } from '../../service/item-service/item.service';
import { toNotifications } from "../../service/common.service";
let ViewDataThumbnailPageComponent = class ViewDataThumbnailPageComponent {
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
        combineLatest(this.attributeService.getAllAttributesByView(viewId), this.itemService.getAllItems(viewId)).pipe(map((r) => {
            const attributes = r[0];
            const items = r[1];
            this.itemAndAttributeSet = {
                attributes,
                items,
            };
            this.done = true;
        })).subscribe();
    }
    onDataThumbnailEvent($event) {
        switch ($event.type) {
            case 'modification':
                combineLatest([
                    this.itemService.saveItems(this.currentView.id, $event.modifiedItems),
                    this.itemService.deleteItems(this.currentView.id, $event.deletedItems)
                ]).subscribe((r) => {
                    toNotifications(this.notificationService, r[0]);
                    toNotifications(this.notificationService, r[1]);
                    this.reload();
                });
                break;
            case 'reload':
                this.reload();
                break;
        }
    }
    onDataThumbnailSearchEvent($event) {
        this.search = $event.search;
        this.searchType = $event.type;
        this.reload();
    }
};
ViewDataThumbnailPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './view-data-thumbnail.page.html',
        styleUrls: ['./view-data-thumbnail.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [AttributeService,
        NotificationsService,
        ViewService,
        ItemService])
], ViewDataThumbnailPageComponent);
export { ViewDataThumbnailPageComponent };
//# sourceMappingURL=view-data-thumbnail.page.js.map