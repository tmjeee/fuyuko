import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth-service/auth.service';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {SettingsService} from '../../service/settings-service/settings.service';
import {BrowserLocationHistoryService} from '../../service/browser-location-history-service/browser-location-history.service';
import {LoginResponse} from '@fuyuko-common/model/api-response.model';
import {isApiResponseSuccess, toNotifications} from '../../service/common.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPageComponent implements OnInit, AfterViewInit {

  ready: boolean;

  formGroup: FormGroup;
  formControlUsername: FormControl;
  formControlPassword: FormControl;
  formControlRememberMe: FormControl;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private settingsService: SettingsService,
              private notificationService: NotificationsService,
              private browserLocationHistoryService: BrowserLocationHistoryService,
              private router: Router) {
    this.formControlUsername = formBuilder.control('', [Validators.required]);
    this.formControlPassword = formBuilder.control('', [Validators.required]);
    this.formControlRememberMe = formBuilder.control('', []);
    this.formGroup = this.formBuilder.group({
      username: this.formControlUsername,
      password: this.formControlPassword,
      rememberMe: this.formControlRememberMe
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => (this.ready = true));
  }

  onSubmit() {
    this.notificationService.remove();
    this.authService
      .login(this.formControlUsername.value, this.formControlPassword.value, this.formControlRememberMe.value)
      .pipe(
        map((u: LoginResponse) => {
          if (isApiResponseSuccess(u)) {
            const lastUrl: string = this.browserLocationHistoryService.retrieveLastUrl();
            this.browserLocationHistoryService.clearStoredLastUrl();
            if (!!lastUrl) {
              location.href = lastUrl;
            } else {
              this.router.navigate(['/dashboard-layout', {outlets: {primary: ['dashboard'], help: ['dashboard-help']}}]);
            }
          } else {
              toNotifications(this.notificationService, u);
          }
          return u;
        }),
      ).subscribe();
    return false;
  }

  ngOnInit(): void {
  }
}
