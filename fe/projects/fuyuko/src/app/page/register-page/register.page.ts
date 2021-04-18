import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MyErrorStateMatcher} from '../../utils/my-error-state-matcher.util';
import {RegistrationService} from '../../service/registration-service/registration.service';
import {tap} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';
import {toNotifications} from '../../service/common.service';
import {RegistrationResponse} from '@fuyuko-common/model/api-response.model';

@Component({
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPageComponent implements OnInit {

  formGroup: FormGroup;
  formControlEmail: FormControl;
  formControlUsername: FormControl;
  formControlFirstName: FormControl;
  formControlLastName: FormControl;
  formGroupPassword: FormGroup;
  formControlPassword: FormControl;
  formControlConfirmPassword: FormControl;
  errorStateMatcher: ErrorStateMatcher;

  constructor(private formBuilder: FormBuilder,
              private registrationService: RegistrationService,
              private notificationSerivce: NotificationsService) {
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
    this.formGroupPassword.setValidators((formGroupPassword: AbstractControl) => {
      const p1: string = (formGroupPassword as FormGroup).controls.password.value;
      const p2: string = (formGroupPassword as FormGroup).controls.confirmPassword.value;
      if (p1 !== p2) {
        return { passwordMatch: true };
      }
      return null;
    });
  }

  onSubmit() {
      this.registrationService
          .register(this.formControlEmail.value, this.formControlUsername.value, this.formControlFirstName.value,
              this.formControlLastName.value, this.formControlPassword.value)
          .pipe(
              tap((r: RegistrationResponse) => {
                  toNotifications(this.notificationSerivce, r);
              })
          ).subscribe();
  }

  ngOnInit(): void {
  }
}
