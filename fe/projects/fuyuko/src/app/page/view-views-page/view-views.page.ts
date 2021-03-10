import {Component, OnInit} from '@angular/core';
import {ViewService} from '../../service/view-service/view.service';
import {finalize, tap} from 'rxjs/operators';
import {View} from '@fuyuko-common/model/view.model';
import {ViewTableComponentEvent} from '../../component/view-component/view-table.component';
import {combineLatest} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {LoadingService} from '../../service/loading-service/loading.service';


@Component({
  templateUrl: './view-views.page.html',
  styleUrls: ['./view-views.page.scss']
})
export class ViewViewsPageComponent implements OnInit {

    done: boolean;

    views: View[];

    constructor(private viewService: ViewService,
                private notificationService: NotificationsService,
                private loadingService: LoadingService) {
        this.done = false;
    }

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.done = false;
        this.loadingService.startLoading();
        this.viewService
            .getAllViews()
            .pipe(
                tap((v: View[]) => {
                    this.views = v;
                    this.done = true;
                }),
                finalize(() => {
                    this.done = true;
                    this.loadingService.stopLoading();
                })
            ).subscribe();
    }

    onViewTableEvent($event: ViewTableComponentEvent) {
        switch ($event.type) {
            case 'UPDATE':
                combineLatest([
                    this.viewService.saveViews($event.updatedViews),
                    this.viewService.deleteViews($event.deletedViews)
                ]).pipe(
                   tap((r: [ApiResponse, ApiResponse]) => {
                       if ($event.updatedViews.length) {
                           toNotifications(this.notificationService, r[0]);
                       }
                       if ($event.deletedViews.length) {
                           toNotifications(this.notificationService, r[1]);
                       }
                       this.reload();
                   }),
                ).subscribe();
                break;
            case 'RELOAD':
                this.reload();
                break;
        }
    }

}
