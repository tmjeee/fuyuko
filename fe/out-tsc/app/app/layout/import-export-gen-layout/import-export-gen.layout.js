import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AppNotificationService } from '../../service/app-notification-service/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractGenSubLayoutComponent } from '../abstract-gen-sub.layout';
import { AuthService } from '../../service/auth-service/auth.service';
import { SettingsService } from '../../service/settings-service/settings.service';
let ImportExportLayoutComponent = class ImportExportLayoutComponent extends AbstractGenSubLayoutComponent {
    constructor(notificationService, authService, settingsService, router, route) {
        super(notificationService, authService, settingsService, route, router);
    }
};
ImportExportLayoutComponent = tslib_1.__decorate([
    Component({
        templateUrl: './import-export-gen.layout.html',
        styleUrls: ['./import-export-gen.layout.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [AppNotificationService,
        AuthService,
        SettingsService,
        Router,
        ActivatedRoute])
], ImportExportLayoutComponent);
export { ImportExportLayoutComponent };
//# sourceMappingURL=import-export-gen.layout.js.map