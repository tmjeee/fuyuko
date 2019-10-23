import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AppNotificationService} from '../../service/app-notification-service/app-notification.service';
import {AbstractGenSubLayoutComponent} from '../abstract-gen-sub.layout';
import {AuthService} from '../../service/auth-service/auth.service';
import {SettingsService} from '../../service/settings-service/settings.service';


@Component({
  templateUrl: './user-gen.layout.html',
  styleUrls: ['./user-gen.layout.scss']
})
export class UserLayoutComponent extends AbstractGenSubLayoutComponent {

  constructor(notificationService: AppNotificationService,
              authService: AuthService,
              settingsService: SettingsService,
              route: ActivatedRoute, router: Router) {
    super(notificationService, authService, settingsService, route, router);
  }
}

