import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AbstractGenLayoutComponent } from '../abstract-gen.layout';
import { AppNotificationService } from '../../service/app-notification-service/app-notification.service';
import { AuthService } from '../../service/auth-service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../../service/settings-service/settings.service';
let DashboardLayoutComponent = class DashboardLayoutComponent extends AbstractGenLayoutComponent {
    constructor(notificationService, authService, settingsService, router, route) {
        super(notificationService, authService, settingsService, router, route);
    }
};
DashboardLayoutComponent = tslib_1.__decorate([
    Component({
        templateUrl: './dashboard.layout.html',
        styleUrls: ['./dashboard.layout.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [AppNotificationService,
        AuthService,
        SettingsService,
        Router,
        ActivatedRoute])
], DashboardLayoutComponent);
export { DashboardLayoutComponent };
//# sourceMappingURL=dashboard.layout.js.map