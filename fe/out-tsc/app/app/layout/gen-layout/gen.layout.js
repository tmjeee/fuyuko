import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AppNotificationService } from '../../service/app-notification-service/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractGenLayoutComponent } from '../abstract-gen.layout';
import { AuthService } from '../../service/auth-service/auth.service';
import { SettingsService } from '../../service/settings-service/settings.service';
let GenLayoutComponent = class GenLayoutComponent extends AbstractGenLayoutComponent {
    constructor(notificationService, authService, settingsService, router, route) {
        super(notificationService, authService, settingsService, router, route);
    }
};
GenLayoutComponent = tslib_1.__decorate([
    Component({
        templateUrl: './gen.layout.html',
        styleUrls: ['./gen.layout.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [AppNotificationService,
        AuthService,
        SettingsService,
        Router,
        ActivatedRoute])
], GenLayoutComponent);
export { GenLayoutComponent };
//# sourceMappingURL=gen.layout.js.map