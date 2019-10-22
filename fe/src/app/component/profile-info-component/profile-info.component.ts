import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../model/user.model';
import {AuthService} from '../../service/auth-service/auth.service';

export interface ProfileInfoComponentEvent {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}


@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  formControlFirstName: FormControl;
  formControlLastName: FormControl;
  formControlUsername: FormControl;
  formControlEmail: FormControl;

  @Input() user: User;
  @Output() events: EventEmitter<ProfileInfoComponentEvent>;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.formControlFirstName = this.formBuilder.control('', [Validators.required]);
    this.formControlLastName = this.formBuilder.control('', [Validators.required]);
    this.formControlUsername = this.formBuilder.control('', [Validators.required]);
    this.formControlEmail = this.formBuilder.control('', [Validators.required, Validators.email]);
    this.formGroup = this.formBuilder.group({
      firstName: this.formControlFirstName,
      lastName: this.formControlLastName,
      username: this.formControlUsername,
      email: this.formControlEmail
    });
    this.events = new EventEmitter();
  }

  ngOnInit(): void {
    if (this.user) {
      this.formControlFirstName.setValue(this.user.firstName);
      this.formControlLastName.setValue(this.user.lastName);
      this.formControlUsername.setValue(this.user.username);
      this.formControlEmail.setValue(this.user.email);
    }
  }

  ngOnDestroy(): void {
  }

  onSubmit() {
    this.events.emit({
      firstName: this.formControlFirstName.value,
      lastName: this.formControlLastName.value,
      username: this.formControlLastName.value,
      email: this.formControlEmail.value
    } as ProfileInfoComponentEvent);
  }

}
