import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ActivationService} from '../../service/activation-service/activation.service';
import {tap} from 'rxjs/operators';
import {Activation, Invitation} from '../../model/activation.model';
import {ErrorStateMatcher} from '@angular/material/core';
import {MyErrorStateMatcher} from '../../utils/my-error-state-matcher.util';

@Component({
    templateUrl: './activate.page.html',
    styleUrls: ['./activate.page.scss']
})
export class ActivatePageComponent implements OnInit {

    formGroup: FormGroup;
    formGroupPassword: FormGroup;
    formControlEmail: FormControl;
    formControlUsername: FormControl;
    formControlFirstName: FormControl;
    formControlLastName: FormControl;
    formControlPassword: FormControl;
    formControlConfirmPassword: FormControl;

    code: string;
    status: 'ERROR' | 'SUCCESS';
    message: string;
    invitation: Invitation;
    errorStateMatcher: ErrorStateMatcher = new MyErrorStateMatcher();

    constructor(private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private activationService: ActivationService) {
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
        this.formGroupPassword.setValidators((fg: FormGroup) => {
            const password1: string = fg.controls.password.value;
            const password2: string = fg.controls.confirmPassword.value;
            if (password1 !== password2) {
                return { passwordMatch: true };
            }
            return null;
        });
    }

    ngOnInit(): void {
        this.code = this.activatedRoute.snapshot.params.code;
        if (!!!this.code) {
            this.status = 'ERROR';
            this.message = `Missing code for activation`;
            return;
        }
        this.activationService.getInvitation(this.code)
            .pipe(
                tap((i: Invitation) => {
                    if (i) {
                        this.invitation = i;
                        this.formControlEmail.setValue(i.email);
                    } else {
                        this.status = 'ERROR';
                        this.message = 'Bad code';
                    }
                })
            ).subscribe();
    }


    onSubmit() {
        this.activationService
            .activate(this.code,
                this.formControlEmail.value,
                this.formControlUsername.value,
                this.formControlFirstName.value,
                this.formControlLastName.value,
                this.formControlPassword.value)
            .pipe(
                tap((a: Activation) => {
                    this.status = a.status;
                    this.message = a.message;
                })
            ).subscribe();
    }
}
