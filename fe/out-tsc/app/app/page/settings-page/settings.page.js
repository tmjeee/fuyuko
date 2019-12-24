import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AuthService } from '../../service/auth-service/auth.service';
import { SettingsService } from '../../service/settings-service/settings.service';
import { tap } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';
let SettingsPageComponent = class SettingsPageComponent {
    constructor(authService, notificationService, settingsService) {
        this.authService = authService;
        this.notificationService = notificationService;
        this.settingsService = settingsService;
    }
    ngOnInit() {
        this.reload();
    }
    reload() {
        this.ready = false;
        this.currentUser = this.authService.myself();
        this.settingsService.getSettings(this.currentUser)
            .pipe(tap((s) => {
            this.settings = s;
            this.ready = true;
        })).subscribe();
    }
    onSettingsEvent($event) {
        this.settingsService.saveSettings($event.settings)
            .pipe(tap((s) => {
            this.settings = s;
            this.notificationService.info('Saved', 'Settings changes save');
        })).subscribe();
    }
};
SettingsPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './settings.page.html',
        styleUrls: ['./settings.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [AuthService,
        NotificationsService,
        SettingsService])
], SettingsPageComponent);
export { SettingsPageComponent };
//# sourceMappingURL=settings.page.js.map