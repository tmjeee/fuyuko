import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppNotificationService } from '../../service/app-notification-service/app-notification.service';
import { AbstractGenSubLayoutComponent } from '../abstract-gen-sub.layout';
import { AuthService } from '../../service/auth-service/auth.service';
import { SettingsService } from '../../service/settings-service/settings.service';
let UserLayoutComponent = class UserLayoutComponent extends AbstractGenSubLayoutComponent {
    constructor(notificationService, authService, settingsService, route, router) {
        super(notificationService, authService, settingsService, route, router);
    }
};
UserLayoutComponent = tslib_1.__decorate([
    Component({
        templateUrl: './user-gen.layout.html',
        styleUrls: ['./user-gen.layout.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [AppNotificationService,
        AuthService,
        SettingsService,
        ActivatedRoute, Router])
], UserLayoutComponent);
export { UserLayoutComponent };
//# sourceMappingURL=user-gen.layout.js.map