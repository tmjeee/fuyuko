import {AbstractGenLayoutComponent} from './abstract-gen.layout';
import {ActivatedRoute, Router} from '@angular/router';
import {AppNotificationService} from '../service/app-notification-service/app-notification.service';
import {AuthService} from '../service/auth-service/auth.service';


export class AbstractGenSubLayoutComponent extends AbstractGenLayoutComponent {

  subSideBarOpened: boolean ;

  constructor(notificationService: AppNotificationService,
              authService: AuthService, route: ActivatedRoute, router: Router) {
    super(notificationService, authService, router, route);
    this.subSideBarOpened = true;
  }

  onSubSidebarButtonClicked($event: MouseEvent) {
    this.subSideBarOpened = !this.subSideBarOpened;
  }
}
