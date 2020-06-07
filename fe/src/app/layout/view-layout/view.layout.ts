import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractGenSubLayoutComponent} from '../abstract-gen-sub.layout';
import {AuthService} from '../../service/auth-service/auth.service';
import {AppNotificationService} from '../../service/app-notification-service/app-notification.service';
import {ViewService} from '../../service/view-service/view.service';
import {Subscription} from 'rxjs';
import {View} from '../../model/view.model';
import {finalize, map} from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import {SettingsService} from '../../service/settings-service/settings.service';


@Component({
  templateUrl: './view.layout.html',
  styleUrls: ['./view.layout.scss']
})
export class ViewLayoutComponent extends AbstractGenSubLayoutComponent implements  OnInit, OnDestroy {

  private subscription: Subscription;

  currentView: View;

  allViews: View[];

  ready: boolean;

  constructor(appNotificationService: AppNotificationService,
              authService: AuthService,
              settingsService: SettingsService,
              router: Router,
              route: ActivatedRoute,
              protected viewService: ViewService) {
    super(appNotificationService, authService, settingsService, route, router);
  }


  ngOnInit(): void {
    super.ngOnInit();

    this.ready = false;
    this.viewService
      .getAllViews()
      .pipe(
        map((v: View[]) => {
          this.allViews = v;
        }),
        map(() => {
            this.subscription = this.viewService
                .asObserver()
                .pipe(
                    map((v: View) => {
                        if (v) {
                            this.currentView = this.allViews ? this.allViews.find((vv: View) => vv.id === v.id) : undefined;
                        } else if (!this.currentView && this.allViews.length) {
                            this.viewService.setCurrentView(this.allViews[0]);
                        }
                    }),
                    finalize(() => this.ready = true)
                ).subscribe();
        }),
      ).subscribe();

  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onViewSelectionChange($event: MatSelectChange) {
    const view: View = $event.value;
    this.viewService.setCurrentView(view);
  }
}
