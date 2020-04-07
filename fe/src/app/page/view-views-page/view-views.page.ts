import {Component, OnInit} from '@angular/core';
import {ViewService} from '../../service/view-service/view.service';
import {tap} from 'rxjs/operators';
import {View} from '../../model/view.model';
import {ViewTableComponentEvent} from '../../component/view-component/view-table.component';
import {combineLatest, forkJoin} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {ApiResponse} from '../../model/response.model';
import {toNotifications} from '../../service/common.service';


@Component({
  templateUrl: './view-views.page.html',
  styleUrls: ['./view-views.page.scss']
})
export class ViewViewsPageComponent implements OnInit {

    done: boolean;

    views: View[];

    constructor(private viewService: ViewService, private notificationService: NotificationsService) {
        this.done = false;
    }

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.done = false;
        this.viewService
            .getAllViews()
            .pipe(
                tap((v: View[]) => {
                    this.views = v;
                    this.done = true;
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
