import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth-service/auth.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { SettingsService } from '../../service/settings-service/settings.service';
let LoginPageComponent = class LoginPageComponent {
    constructor(formBuilder, authService, settingsService, notificationService, router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.settingsService = settingsService;
        this.notificationService = notificationService;
        this.router = router;
        this.formControlUsername = formBuilder.control('', [Validators.required]);
        this.formControlPassword = formBuilder.control('', [Validators.required]);
        this.formGroup = this.formBuilder.group({
            username: this.formControlUsername,
            password: this.formControlPassword
        });
    }
    onSubmmit() {
        this.authService
            .login(this.formControlUsername.value, this.formControlPassword.value)
            .pipe(map((u) => {
            if (u && u.status === 'SUCCESS') {
                this.router.navigate(['/dashboard-layout', 'dashboard']);
            }
            else {
                this.notificationService.error('Error', 'Unexpected error logging in');
            }
            return u;
        })).subscribe();
    }
};
LoginPageComponent = tslib_1.__decorate([
    Component({
        selector: 'app-login-page',
        templateUrl: './login.page.html',
        styleUrls: ['./login.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder,
        AuthService,
        SettingsService,
        NotificationsService,
        Router])
], LoginPageComponent);
export { LoginPageComponent };
//# sourceMappingURL=login.page.js.map