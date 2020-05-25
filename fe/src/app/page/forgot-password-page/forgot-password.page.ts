import {Component} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {AuthService} from "../../service/auth-service/auth.service";
import {ApiResponse} from "../../model/api-response.model";
import {tap} from "rxjs/operators";
import {toNotifications} from "../../service/common.service";
import {NotificationsService} from "angular2-notifications";

@Component({
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss']
})
export class ForgotPasswordPageComponent {

    formGroupUsername: FormGroup;
    formGroupEmail: FormGroup;
    formControlUsername: FormControl;
    formControlEmail: FormControl;

    constructor(private formBuilder: FormBuilder,
                private notificationsService: NotificationsService,
                private authService: AuthService) {
        this.formControlUsername = formBuilder.control('', [Validators.required]);
        this.formGroupUsername = formBuilder.group({
            username: this.formControlUsername
        });
        this.formControlEmail = formBuilder.control('', [Validators.required, Validators.email]);
        this.formGroupEmail = formBuilder.group({
            email: this.formControlEmail
        });
    }

    onSubmitByEmail() {
        this.authService.forgotPassword({email: this.formControlEmail.value}).pipe(
            tap((r: ApiResponse) => {
                toNotifications(this.notificationsService, r);
            })
        ).subscribe()
    }

    onSubmitByUsername() {
        this.authService.forgotPassword({username: this.formControlUsername.value}).pipe(
            tap((r: ApiResponse) => {
                toNotifications(this.notificationsService, r);
            })
        ).subscribe()
    }
}