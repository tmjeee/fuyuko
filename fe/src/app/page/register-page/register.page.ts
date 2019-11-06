import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPageComponent implements OnInit {

  formGroup: FormGroup;
  formControlEmail: FormControl;
  formControlUsername: FormControl;
  formControlPassword: FormControl;
  formControlConfirmPassword: FormControl;

  constructor(private formBuilder: FormBuilder) {
    this.formControlEmail = this.formBuilder.control('', [Validators.required, Validators.email]);
    this.formControlUsername = this.formBuilder.control('', [Validators.required]);
    this.formControlPassword = this.formBuilder.control('', [Validators.required]);
    this.formControlConfirmPassword = this.formBuilder.control('', [Validators.required]);
    this.formGroup = this.formBuilder.group({
      username: this.formControlUsername,
      email: this.formControlEmail,
      password: this.formControlPassword,
      confirmPassword: this.formControlConfirmPassword
    });
  }

  onSubmit() {

  }

  ngOnInit(): void {
  }
}
