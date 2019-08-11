import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractGenSubLayoutComponent} from '../abstract-gen-sub.layout';
import {AuthService} from '../../service/auth-service/auth.service';
import {AppNotificationService} from '../../service/app-notification-service/app-notification.service';
import {ViewService} from '../../service/view-service/view.service';
import {Subscription} from 'rxjs';
import {View} from '../../model/view.model';
import {map} from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';


@Component({
  templateUrl: './view-gen.layout.html',
  styleUrls: ['./view-gen.layout.scss']
})
export class ViewLayoutComponent extends AbstractGenSubLayoutComponent implements  OnInit, OnDestroy {

  private subscription: Subscription;

  currentView: View;

  allViews: View[];

  ready: boolean;

  constructor(appNotificationService: AppNotificationService,
              authService: AuthService,
              router: Router,
              route: ActivatedRoute,
              protected viewService: ViewService) {
    super(appNotificationService, authService, route, router);
  }


  ngOnInit(): void {
    super.ngOnInit();

    this.viewService
      .getAllViews()
      .pipe(
        map((v: View[]) => {
          this.allViews = v;
          if (!this.currentView && this.allViews.length) {
            this.viewService.setCurrentView(v[0]);
          }
          this.ready = true;
        }),
        map(() => {
            this.subscription = this.viewService
                .asObserver()
                .pipe(
                    map((v: View) => {
                        if (v) {
                            this.currentView = this.allViews ? this.allViews.find((vv: View) => vv.id === v.id) : undefined;
                        }
                    })
                ).subscribe();
        })
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
