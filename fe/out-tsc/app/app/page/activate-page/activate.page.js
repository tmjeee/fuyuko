import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActivationService } from '../../service/activation-service/activation.service';
import { tap } from 'rxjs/operators';
import { MyErrorStateMatcher } from '../../utils/my-error-state-matcher.util';
let ActivatePageComponent = class ActivatePageComponent {
    constructor(formBuilder, activatedRoute, activationService) {
        this.formBuilder = formBuilder;
        this.activatedRoute = activatedRoute;
        this.activationService = activationService;
        this.errorStateMatcher = new MyErrorStateMatcher();
        this.status = null;
        this.message = '';
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
            username: this.formControlUsername,
            email: this.formControlEmail,
            firstName: this.formControlFirstName,
            lastName: this.formControlLastName,
            passwordGroup: this.formGroupPassword
        });
        this.formGroupPassword.setValidators((fg) => {
            const password1 = fg.controls.password.value;
            const password2 = fg.controls.confirmPassword.value;
            if (password1 !== password2) {
                return { passwordMatch: true };
            }
            return null;
        });
    }
    ngOnInit() {
        this.code = this.activatedRoute.snapshot.params.code;
        if (!!!this.code) {
            this.status = 'ERROR';
            this.message = `Missing code for activation`;
            return;
        }
        this.activationService.getInvitation(this.code)
            .pipe(tap((i) => {
            if (i) {
                this.invitation = i;
                this.formControlEmail.setValue(i.email);
            }
            else {
                this.status = 'ERROR';
                this.message = 'Bad code';
            }
        })).subscribe();
    }
    onSubmit() {
        this.activationService
            .activate(this.code, this.formControlEmail.value, this.formControlUsername.value, this.formControlFirstName.value, this.formControlLastName.value, this.formControlPassword.value)
            .pipe(tap((a) => {
            this.status = a.status;
            this.message = a.message;
        })).subscribe();
    }
};
ActivatePageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './activate.page.html',
        styleUrls: ['./activate.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder,
        ActivatedRoute,
        ActivationService])
], ActivatePageComponent);
export { ActivatePageComponent };
//# sourceMappingURL=activate.page.js.map