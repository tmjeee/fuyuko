import {AbstractGenLayoutComponent} from './abstract-gen.layout';
import {ActivatedRoute, Router} from '@angular/router';
import {AppNotificationService} from '../service/app-notification-service/app-notification.service';
import {AuthService} from '../service/auth-service/auth.service';
import {SettingsService} from '../service/settings-service/settings.service';
import {RuntimeSettings} from '../model/settings.model';
import {OnInit} from '@angular/core';


export class AbstractGenSubLayoutComponent extends AbstractGenLayoutComponent implements OnInit {

  subSideBarOpened: boolean ;

  constructor(notificationService: AppNotificationService,
              authService: AuthService,
              settingsService: SettingsService,
              route: ActivatedRoute,
              router: Router) {
    super(notificationService, authService, settingsService, router, route);
  }


  ngOnInit(): void {
    super.ngOnInit();
    this.subSideBarOpened = this.runtimeSettings.openSubSideNav;
  }

  onSubSidebarButtonClicked($event: MouseEvent) {
    this.subSideBarOpened = !this.subSideBarOpened;
  }
}
