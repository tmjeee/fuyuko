import * as tslib_1 from "tslib";
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
export const passwordValidator = () => {
    return (control) => {
        const formGroup = control;
        const formControlPassword = formGroup.controls.password;
        const formControlConfirmPassword = formGroup.controls.confirmPassword;
        return ((formControlPassword.value === formControlConfirmPassword.value) ? null : {
            passwordValidator: true
        });
    };
};
let PasswordComponent = class PasswordComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.formControlPassword = this.formBuilder.control('', [Validators.required]);
        this.formControlConfirmPassword = this.formBuilder.control('', [Validators.required]);
        this.formGroup = this.formBuilder.group({
            password: this.formControlPassword,
            confirmPassword: this.formControlConfirmPassword
        }, { validators: passwordValidator() });
        this.events = new EventEmitter();
    }
    onSubmit() {
        this.events.emit({
            password: this.formControlPassword.value
        });
    }
};
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], PasswordComponent.prototype, "events", void 0);
PasswordComponent = tslib_1.__decorate([
    Component({
        selector: 'app-password',
        templateUrl: './password.component.html',
        styleUrls: ['./password.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], PasswordComponent);
export { PasswordComponent };
//# sourceMappingURL=password.component.js.map