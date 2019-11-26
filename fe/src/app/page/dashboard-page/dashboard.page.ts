import {Component, OnInit, Type} from '@angular/core';
import {DashboardService} from '../../service/dashboard-service/dashboard.service';
import {
    DashboardStrategy,
    DashboardWidgetInfo,
} from '../../model/dashboard.model';
import {AuthService} from '../../service/auth-service/auth.service';
import {User} from '../../model/user.model';
import {DashboardComponentEvent} from '../../component/dashboard-component/dashboard.component';
import {tap} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';


@Component({
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent implements OnInit {
    strategies: DashboardStrategy[];
    selectedStrategy: DashboardStrategy;
    dashboardWidgetInfos: DashboardWidgetInfo[];
    data: string;

    constructor(private dashboardService: DashboardService,
                private authService: AuthService,
                private notificationsService: NotificationsService) {}

    ngOnInit(): void {
        this.strategies = this.dashboardService.getAllDashboardStrategies();
        this.selectedStrategy = this.strategies[1];

        this.dashboardWidgetInfos = this.dashboardService.getAllDashboardWidgetInfos();

        const myself: User = this.authService.myself();
        this.data = this.dashboardService.getUserDashboardLayoutData(myself);

    }

    onDashboardEvent($event: DashboardComponentEvent) {
        console.log('********** onDashboardEvent', $event);
        this.notificationsService.success('Success', 'testing 123');
        this.notificationsService.info('Info', 'testing 123 asd sid iasdo oais diaosid asd iois iod iaoi dioisd ioiosd ioioaisd iosd');
        this.notificationsService.warn('Warninig', 'testing 123 sioio asdio iosid iosdsd');
        this.notificationsService.error('Error', 'testing 123 iaoisdi aposidiaps diaopsid osidopai sdiosido sido siod sod apidsosipoaidois iudsdis udisudiauisdsiud ');
        /*
        this.dashboardService.saveDashboardLayout($event.serializedData)
            .pipe(
                tap((r: boolean) => {
                    if (r) {
                        this.notificationsService.success(`Success`, `Dashboard layout saved`);
                    } else {
                        this.notificationsService.error(`Error`, `Dashboard layout failed`);
                    }
                })
            ).subscribe();
         */
    }
}
