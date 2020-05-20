import {Component} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss']
})
export class ForgotPasswordPageComponent {

    formGroupUsername: FormGroup;
    formGroupEmail: FormGroup;
    formControlUsername: FormControl;
    formControlEmail: FormControl;

    constructor(private formBuilder: FormBuilder) {
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

    }

    onSubmitByUsername() {

    }
}