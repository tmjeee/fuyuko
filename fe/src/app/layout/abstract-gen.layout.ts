import {OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AppNotificationService} from '../service/app-notification-service/app-notification.service';
import {ActivatedRoute, ActivatedRouteSnapshot, Router, Event as RouterEvent, NavigationEnd} from '@angular/router';
import {filter, map, tap} from 'rxjs/operators';
import {AppNotification} from '../model/notification.model';
import {AuthService} from '../service/auth-service/auth.service';
import {User} from '../model/user.model';
import {SettingsService} from '../service/settings-service/settings.service';
import {Settings} from '../model/settings.model';

export class AbstractGenLayoutComponent implements OnInit, OnDestroy {

  loading: boolean;

  routeSubSideNavData: string;

  subSideBarOpened: boolean ;
  sideNavOpened: boolean;
  helpNavOpened: boolean;

  myself: User;
  notifications: AppNotification[];

  authServiceSubscription: Subscription;
  notificationServiceSubscription: Subscription;
  routerEventSubscription: Subscription;

  settings: Settings;

  constructor(protected notificationService: AppNotificationService,
              protected authService: AuthService,
              protected settingsService: SettingsService,
              protected router: Router,
              protected route: ActivatedRoute) {
  }


  ngOnInit(): void {
    this.loading = true;
    const u: User = this.authService.myself();
    this.settingsService.getSettings(u).pipe(
        tap((s: Settings) => {
          this.settings = s;
          this.helpNavOpened = this.settings.openHelpNav;
          this.sideNavOpened = this.settings.openSideNav;
          this.subSideBarOpened = this.settings.openSubSideNav;
          this.loading = false;
        })
    ).subscribe();
    console.log('******** ASbstractGenLayout runtime settings', this.settings);
    this.routeSubSideNavData = this.findSubSideNavData([this.route.snapshot]);
    this.routerEventSubscription = this.router.events
      .pipe(
        filter((e: RouterEvent) => e instanceof NavigationEnd),
        map((e: NavigationEnd) => {
          this.routeSubSideNavData = this.findSubSideNavData([this.route.snapshot]);
        })
      ).subscribe();
    this.authServiceSubscription = this.authService.asObservable()
      .pipe(
        map((p: User) => {
          this.myself = p;
          this.notificationService.retrieveNotifications(this.myself);
        })
      ).subscribe();
    this.notificationServiceSubscription = this.notificationService.asObservable()
      .pipe(
        map((n: AppNotification[]) => {
          this.notifications = n;
        })
      ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe();
    }
    if (this.authServiceSubscription) {
      this.authServiceSubscription.unsubscribe();
    }
    if (this.notificationServiceSubscription) {
      this.notificationServiceSubscription.unsubscribe();
    }
  }

  onSideNavExpandCollapseButtonClicked(event: Event) {
    this.sideNavOpened = !this.sideNavOpened;
  }

  onHelpNavExpandCollapseButtonClicked(event: Event) {
    this.helpNavOpened = !this.helpNavOpened;
  }

  onNotificationClicked(event: Event) {

  }

  logout() {
    this.authService
      .logout()
      .pipe(
        map((_) => {
          this.router.navigate(['/login-layout', 'login']);
        })
      ).subscribe();
  }


  findSubSideNavData(r: ActivatedRouteSnapshot[]): string {
    let result: string = null;
    for (const rr of r) {
      result = rr.data.subSideNav;
      if (!result) {
        result =  this.findSubSideNavData(rr.children);
        if (result) {
          return result;
        }
      } else {
        return result;
      }
    }
    return result;
  }

}
