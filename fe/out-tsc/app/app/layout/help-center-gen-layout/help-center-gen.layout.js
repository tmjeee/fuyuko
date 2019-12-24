import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AppNotificationService } from '../../service/app-notification-service/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractGenSubLayoutComponent } from '../abstract-gen-sub.layout';
import { AuthService } from '../../service/auth-service/auth.service';
import { SettingsService } from '../../service/settings-service/settings.service';
let HelpCenterLayoutComponent = class HelpCenterLayoutComponent extends AbstractGenSubLayoutComponent {
    constructor(notificationService, authService, settingsService, router, route) {
        super(notificationService, authService, settingsService, route, router);
    }
};
HelpCenterLayoutComponent = tslib_1.__decorate([
    Component({
        templateUrl: './help-center-gen.layout.html',
        styleUrls: ['./help-center-gen.layout.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [AppNotificationService,
        AuthService,
        SettingsService,
        Router,
        ActivatedRoute])
], HelpCenterLayoutComponent);
export { HelpCenterLayoutComponent };
//# sourceMappingURL=help-center-gen.layout.js.map