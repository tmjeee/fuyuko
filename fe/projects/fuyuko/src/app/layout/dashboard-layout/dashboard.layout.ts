import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractGenLayoutComponent} from '../abstract-gen.layout';
import {AppNotificationService} from '../../service/app-notification-service/app-notification.service';
import {AuthService} from '../../service/auth-service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsService} from '../../service/settings-service/settings.service';
import {LoadingService} from '../../service/loading-service/loading.service';


@Component({
  templateUrl: './dashboard.layout.html',
  styleUrls: ['./dashboard.layout.scss']
})
export class DashboardLayoutComponent extends AbstractGenLayoutComponent implements OnInit, OnDestroy {

  constructor(notificationService: AppNotificationService,
              authService: AuthService,
              settingsService: SettingsService,
              router: Router,
              route: ActivatedRoute,
              loadingService: LoadingService) {
    super(notificationService, authService, settingsService, router, route, loadingService);
  }
}
