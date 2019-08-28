import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';


export const passwordValidator = () => {
  return (control: AbstractControl): ValidationErrors => {
    const formGroup: FormGroup = control as FormGroup;
    const formControlPassword: FormControl = formGroup.controls.password as FormControl;
    const formControlConfirmPassword: FormControl = formGroup.controls.confirmPassword as FormControl;
    return ((formControlPassword.value === formControlConfirmPassword.value) ? null : {
      passwordValidator: true
    });
  };
};

export interface PasswordComponentEvent {
  password: string;
}


@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {

  formGroup: FormGroup;
  formControlPassword: FormControl;
  formControlConfirmPassword: FormControl;

  @Output() events: EventEmitter<PasswordComponentEvent>;

  constructor(private formBuilder: FormBuilder) {
    this.formControlPassword = this.formBuilder.control('', [Validators.required]);
    this.formControlConfirmPassword = this.formBuilder.control('', [Validators.required]);
    this.formGroup = this.formBuilder.group({
      password: this.formControlPassword,
      confirmPassword: this.formControlConfirmPassword
    }, {validators: passwordValidator()});
    this.events = new EventEmitter();
  }

  onSubmit() {
    this.events.emit({
      password: this.formControlPassword.value
    } as PasswordComponentEvent);
  }






}
