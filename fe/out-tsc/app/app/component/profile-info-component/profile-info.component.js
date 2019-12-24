import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth-service/auth.service';
let ProfileInfoComponent = class ProfileInfoComponent {
    constructor(formBuilder, authService) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.formControlFirstName = this.formBuilder.control('', [Validators.required]);
        this.formControlLastName = this.formBuilder.control('', [Validators.required]);
        this.formControlEmail = this.formBuilder.control('', [Validators.required, Validators.email]);
        this.formGroup = this.formBuilder.group({
            firstName: this.formControlFirstName,
            lastName: this.formControlLastName,
            email: this.formControlEmail
        });
        this.events = new EventEmitter();
    }
    ngOnInit() {
        if (this.user) {
            this.formControlFirstName.setValue(this.user.firstName);
            this.formControlLastName.setValue(this.user.lastName);
            this.formControlEmail.setValue(this.user.email);
        }
    }
    ngOnDestroy() {
    }
    onSubmit() {
        this.events.emit({
            firstName: this.formControlFirstName.value,
            lastName: this.formControlLastName.value,
            email: this.formControlEmail.value
        });
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], ProfileInfoComponent.prototype, "user", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ProfileInfoComponent.prototype, "events", void 0);
ProfileInfoComponent = tslib_1.__decorate([
    Component({
        selector: 'app-profile-info',
        templateUrl: './profile-info.component.html',
        styleUrls: ['./profile-info.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder, AuthService])
], ProfileInfoComponent);
export { ProfileInfoComponent };
//# sourceMappingURL=profile-info.component.js.map