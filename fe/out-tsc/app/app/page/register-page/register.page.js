import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../utils/my-error-state-matcher.util';
import { RegistrationService } from '../../service/registration-service/registration.service';
import { tap } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';
import { toNotifications } from '../../service/common.service';
let RegisterPageComponent = class RegisterPageComponent {
    constructor(formBuilder, registrationService, notificationSerivce) {
        this.formBuilder = formBuilder;
        this.registrationService = registrationService;
        this.notificationSerivce = notificationSerivce;
        this.errorStateMatcher = new MyErrorStateMatcher();
        this.formControlEmail = this.formBuilder.control('', [Validators.required, Validators.email]);
        this.formControlUsername = this.formBuilder.control('', [Validators.required]);
        this.formControlFirstName = this.formBuilder.control('', [Validators.required]);
        this.formControlLastName = this.formBuilder.control('', [Validators.required]);
        this.formControlPassword = this.formBuilder.control('', [Validators.required]);
        this.formControlConfirmPassword = this.formBuilder.control('', [Validators.required]);
        this.formGroupPassword = this.formBuilder.group({
            password: this.formControlPassword,
            confirmPassword: this.formControlConfirmPassword
        });
        this.formGroup = this.formBuilder.group({
            email: this.formControlEmail,
            username: this.formControlUsername,
            firstName: this.formControlFirstName,
            lastName: this.formControlLastName,
            formGroupPassword: this.formGroupPassword
        });
        this.formGroupPassword.setValidators((formGroupPassword) => {
            const p1 = formGroupPassword.controls.password.value;
            const p2 = formGroupPassword.controls.confirmPassword.value;
            if (p1 !== p2) {
                return { passwordMatch: true };
            }
            return null;
        });
    }
    onSubmit() {
        this.registrationService
            .register(this.formControlEmail.value, this.formControlUsername.value, this.formControlFirstName.value, this.formControlLastName.value, this.formControlPassword.value)
            .pipe(tap((r) => {
            toNotifications(this.notificationSerivce, r);
        })).subscribe();
    }
    ngOnInit() {
    }
};
RegisterPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './register.page.html',
        styleUrls: ['./register.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder,
        RegistrationService,
        NotificationsService])
], RegisterPageComponent);
export { RegisterPageComponent };
//# sourceMappingURL=register.page.js.map