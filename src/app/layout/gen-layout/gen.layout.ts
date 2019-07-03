import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppNotificationService} from '../../service/app-notification-service/app-notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractGenLayoutComponent} from '../abstract-gen.layout';
import {AuthService} from '../../service/auth-service/auth.service';


@Component({
  templateUrl: './gen.layout.html',
  styleUrls: ['./gen.layout.scss']
})
export class GenLayoutComponent extends AbstractGenLayoutComponent implements OnInit, OnDestroy {


  constructor(notificationService: AppNotificationService,
              authService: AuthService,
              router: Router,
              route: ActivatedRoute) {
    super(notificationService, authService, router, route);
  }


}
