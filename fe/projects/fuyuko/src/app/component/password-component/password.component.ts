import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';


export const passwordValidator = () => {
  return (control: AbstractControl): ValidationErrors | null => {
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
export class PasswordComponent implements OnChanges{

  formGroup: FormGroup;
  formControlPassword: FormControl;
  formControlConfirmPassword: FormControl;

  @Input() disable = false;
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

  ngOnChanges(changes: SimpleChanges): void {
      const change: SimpleChange = changes.disable;
      if (change !== null && change !== undefined) {
        if (change.currentValue) { // disable
          this.formControlPassword.disable();
          this.formControlConfirmPassword.disable();
        } else { // enable
          this.formControlPassword.enable();
          this.formControlConfirmPassword.enable();
        }
      }
  }






}
