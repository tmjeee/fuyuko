import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractGenSubLayoutComponent } from '../abstract-gen-sub.layout';
import { AuthService } from '../../service/auth-service/auth.service';
import { AppNotificationService } from '../../service/app-notification-service/app-notification.service';
import { ViewService } from '../../service/view-service/view.service';
import { map } from 'rxjs/operators';
import { SettingsService } from '../../service/settings-service/settings.service';
let ViewLayoutComponent = class ViewLayoutComponent extends AbstractGenSubLayoutComponent {
    constructor(appNotificationService, authService, settingsService, router, route, viewService) {
        super(appNotificationService, authService, settingsService, route, router);
        this.viewService = viewService;
    }
    ngOnInit() {
        super.ngOnInit();
        this.viewService
            .getAllViews()
            .pipe(map((v) => {
            this.allViews = v;
            if (!this.currentView && this.allViews.length) {
                this.viewService.setCurrentView(v[0]);
            }
            this.ready = true;
        }), map(() => {
            this.subscription = this.viewService
                .asObserver()
                .pipe(map((v) => {
                if (v) {
                    this.currentView = this.allViews ? this.allViews.find((vv) => vv.id === v.id) : undefined;
                }
            })).subscribe();
        })).subscribe();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    onViewSelectionChange($event) {
        const view = $event.value;
        this.viewService.setCurrentView(view);
    }
};
ViewLayoutComponent = tslib_1.__decorate([
    Component({
        templateUrl: './view-gen.layout.html',
        styleUrls: ['./view-gen.layout.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [AppNotificationService,
        AuthService,
        SettingsService,
        Router,
        ActivatedRoute,
        ViewService])
], ViewLayoutComponent);
export { ViewLayoutComponent };
//# sourceMappingURL=view-gen.layout.js.map