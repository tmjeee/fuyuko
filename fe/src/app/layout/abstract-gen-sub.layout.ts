import {AbstractGenLayoutComponent} from './abstract-gen.layout';
import {ActivatedRoute, Router} from '@angular/router';
import {AppNotificationService} from '../service/app-notification-service/app-notification.service';
import {AuthService} from '../service/auth-service/auth.service';
import {SettingsService} from '../service/settings-service/settings.service';
import {OnInit} from '@angular/core';


export class AbstractGenSubLayoutComponent extends AbstractGenLayoutComponent implements OnInit {

  constructor(notificationService: AppNotificationService,
              authService: AuthService,
              settingsService: SettingsService,
              route: ActivatedRoute,
              router: Router) {
    super(notificationService, authService, settingsService, router, route);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onSubSidebarButtonClicked($event: MouseEvent) {
    this.subSideBarOpened = !this.subSideBarOpened;
  }
}
