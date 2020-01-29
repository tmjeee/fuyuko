import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth-service/auth.service';
import {map, tap} from 'rxjs/operators';
import {User} from '../../model/user.model';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {SettingsService} from '../../service/settings-service/settings.service';
import {LoginResponse} from '../../model/login.model';
import {BrowserLocationHistoryService} from '../../service/browser-location-history-service/browser-location-history.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPageComponent {

  formGroup: FormGroup;
  formControlUsername: FormControl;
  formControlPassword: FormControl;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private settingsService: SettingsService,
              private notificationService: NotificationsService,
              private browserLocationHistoryService: BrowserLocationHistoryService,
              private router: Router) {
    this.formControlUsername = formBuilder.control('', [Validators.required]);
    this.formControlPassword = formBuilder.control('', [Validators.required]);
    this.formGroup = this.formBuilder.group({
      username: this.formControlUsername,
      password: this.formControlPassword
    });
  }

  onSubmit() {
    this.notificationService.remove();
    this.authService
      .login(this.formControlUsername.value, this.formControlPassword.value)
      .pipe(
        map((u: LoginResponse) => {
          if (u && u.status === 'SUCCESS') {
            const lastUrl: string = this.browserLocationHistoryService.retrieveLastUrl();
            this.browserLocationHistoryService.clearStoredLastUrl();
            if (!!lastUrl) {
              location.href = lastUrl;
            } else {
              this.router.navigate(['/dashboard-layout', {outlets: {primary: ['dashboard'], help: ['dashboard-help']}}]);
            }
          } else {
            this.notificationService.error('Error', 'Unexpected error logging in');
          }
          return u;
        }),
      ).subscribe();
    return false;
  }
}
