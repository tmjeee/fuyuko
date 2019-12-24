import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AttributeService } from '../../service/attribute-service/attribute.service';
import { ViewService } from '../../service/view-service/view.service';
import { map } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';
import { toNotifications } from "../../service/common.service";
let ViewAttributesPageComponent = class ViewAttributesPageComponent {
    constructor(attributeService, notificationsService, viewService) {
        this.attributeService = attributeService;
        this.notificationsService = notificationsService;
        this.viewService = viewService;
    }
    ngOnInit() {
        this.subscription = this.viewService
            .asObserver()
            .pipe(map((v) => {
            if (v) {
                this.currentView = v;
                this.reloadAttributes();
            }
        })).subscribe();
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    reloadAttributes() {
        if (this.currentView) {
            this.attributeService.getAllAttributesByView(this.currentView.id)
                .pipe(map((a) => {
                this.attributes = a;
            })).subscribe();
        }
    }
    onAttributeTableEvent($event) {
        switch ($event.type) {
            case 'delete':
                this.attributeService
                    .deleteAttribute($event.view, $event.attribute)
                    .pipe(map((a) => {
                    toNotifications(this.notificationsService, a);
                    this.reloadAttributes();
                })).subscribe();
                break;
            case 'search':
                this.attributeService.searchAttribute($event.view.id, $event.search)
                    .pipe(map((a) => {
                    this.attributes = a;
                })).subscribe();
                break;
            case 'add':
                this.attributeService.addAttribute($event.view, $event.attribute)
                    .pipe(map((a) => {
                    toNotifications(this.notificationsService, a);
                    this.reloadAttributes();
                })).subscribe();
                break;
            case 'edit':
                this.attributeService.updateAttribute($event.view, $event.attribute)
                    .pipe(map((a) => {
                    toNotifications(this.notificationsService, a);
                    this.reloadAttributes();
                })).subscribe();
                break;
        }
    }
};
ViewAttributesPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './view-attributes.page.html',
        styleUrls: ['./view-attributes.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [AttributeService,
        NotificationsService,
        ViewService])
], ViewAttributesPageComponent);
export { ViewAttributesPageComponent };
//# sourceMappingURL=view-attributes.page.js.map