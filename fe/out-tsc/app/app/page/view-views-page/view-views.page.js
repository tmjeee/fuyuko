import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ViewService } from '../../service/view-service/view.service';
import { tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { toNotifications } from '../../service/common.service';
let ViewViewsPageComponent = class ViewViewsPageComponent {
    constructor(viewService, notificationService) {
        this.viewService = viewService;
        this.notificationService = notificationService;
        this.done = false;
    }
    ngOnInit() {
        this.reload();
    }
    reload() {
        this.done = false;
        this.viewService
            .getAllViews()
            .pipe(tap((v) => {
            this.views = v;
            this.done = true;
        })).subscribe();
    }
    onViewTableEvent($event) {
        console.log('****************** update', $event);
        switch ($event.type) {
            case 'UPDATE':
                combineLatest([
                    this.viewService.saveViews($event.updatedViews),
                    this.viewService.deleteViews($event.deletedViews)
                ]).pipe(tap((r) => {
                    toNotifications(this.notificationService, r[0]);
                    toNotifications(this.notificationService, r[1]);
                    this.reload();
                })).subscribe();
                break;
            case 'RELOAD':
                this.reload();
                break;
        }
    }
};
ViewViewsPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './view-views.page.html',
        styleUrls: ['./view-views.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ViewService, NotificationsService])
], ViewViewsPageComponent);
export { ViewViewsPageComponent };
//# sourceMappingURL=view-views.page.js.map