import {Component} from '@angular/core';
import {AppNotificationService} from '../../service/app-notification-service/app-notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth-service/auth.service';
import {SettingsService} from '../../service/settings-service/settings.service';
import {AbstractGenSubLayoutComponent} from "../abstract-gen-sub.layout";


@Component({
  templateUrl: './settings.layout.html',
  styleUrls: ['./settings.layout.scss']
})
export class SettingsLayoutComponent extends AbstractGenSubLayoutComponent {


  constructor(notificationService: AppNotificationService,
              authService: AuthService,
              settingsService: SettingsService,
              router: Router,
              route: ActivatedRoute) {
    super(notificationService, authService, settingsService, route, router);
  }


}
