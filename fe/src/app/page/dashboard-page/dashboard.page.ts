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

    loading: boolean;

    strategies: DashboardStrategy[];
    selectedStrategy: DashboardStrategy;
    dashboardWidgetInfos: DashboardWidgetInfo[];
    data: string;

    constructor(private dashboardService: DashboardService,
                private authService: AuthService,
                private notificationsService: NotificationsService) {}

    ngOnInit(): void {
        this.loading = true;
        this.strategies = this.dashboardService.getAllDashboardStrategies();
        this.selectedStrategy = this.strategies[1];

        this.dashboardWidgetInfos = this.dashboardService.getAllDashboardWidgetInfos();

        const myself: User = this.authService.myself();
        this.dashboardService
            .getUserDashboardLayoutData(myself)
            .pipe(
                tap((d: {data: string}) => {
                    console.log('************************* d', d);
                    console.log('data', d.data);
                    const t: any = JSON.parse(d.data);
                    console.log('after parsed', t, (typeof t));
                    this.data = d.data;
                    this.loading = false;
                })
            ).subscribe();
    }

    onDashboardEvent($event: DashboardComponentEvent) {
        const myself: User = this.authService.myself();
        this.dashboardService.saveDashboardLayout(myself, $event.serializedData)
            .pipe(
                tap((r: boolean) => {
                    if (r) {
                        this.notificationsService.success(`Success`, `Dashboard layout saved`);
                    } else {
                        this.notificationsService.error(`Error`, `Dashboard layout failed`);
                    }
                })
            ).subscribe();
    }
}
