import {Component} from '@angular/core';
import {AppNotificationService} from '../../service/app-notification-service/app-notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractGenSubLayoutComponent} from '../abstract-gen-sub.layout';
import {AuthService} from '../../service/auth-service/auth.service';


@Component({
  templateUrl: './import-export-gen.layout.html',
  styleUrls: ['./import-export-gen.layout.scss']
})
export class ImportExportLayoutComponent extends AbstractGenSubLayoutComponent {

  constructor(notificationService: AppNotificationService,
              authService: AuthService,
              router: Router,
              route: ActivatedRoute) {
    super(notificationService, authService, route, router);
  }
}
