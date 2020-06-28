import {Component, OnInit, Type} from '@angular/core';
import {DashboardService} from '../../service/dashboard-service/dashboard.service';
import {
    DashboardStrategy,
    DashboardWidgetInfo,
} from '../../component/dashboard-component/dashboard.model';
import {AuthService} from '../../service/auth-service/auth.service';
import {User} from '../../model/user.model';
import {DashboardComponentEvent} from '../../component/dashboard-component/dashboard.component';
import {finalize, tap} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';
import {SerializedDashboardFormat} from '../../model/dashboard-serialzable.model';
import {ApiResponse} from "../../model/api-response.model";
import {toNotifications} from "../../service/common.service";
import {LoadingService} from "../../service/loading-service/loading.service";

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

    currentUser: User;

    constructor(private dashboardService: DashboardService,
                private authService: AuthService,
                private loadingService: LoadingService,
                private notificationsService: NotificationsService) {}

    ngOnInit(): void {
        this.loading = true;
        this.loadingService.startLoading();
        this.strategies = this.dashboardService.getAllDashboardStrategies();
        this.selectedStrategy = this.strategies[1];

        this.dashboardWidgetInfos = this.dashboardService.getAllDashboardWidgetInfos();

        this.currentUser = this.authService.myself();
        this.dashboardService
            .getUserDashboardLayoutData(this.currentUser)
            .pipe(
                tap((d: string) => {
                    if (d) {
                        const s: SerializedDashboardFormat = JSON.parse(d);
                        const strategyId: string = s.strategyId;
                        const strategy: DashboardStrategy = this.strategies.find((s: DashboardStrategy) => s.id === strategyId);
                        if (strategy) {
                            this.selectedStrategy = strategy;
                        }
                        this.data = d;
                    }
                    this.loading = false;
                }),
                finalize(() => {
                    this.loading = false;
                    this.loadingService.stopLoading();
                })
            ).subscribe();
    }

    onDashboardEvent($event: DashboardComponentEvent) {
        const myself: User = this.authService.myself();
        this.dashboardService.saveDashboardLayout(myself, $event.serializedData)
            .pipe(
                tap((r: ApiResponse) => {
                    toNotifications(this.notificationsService, r);
                })
            ).subscribe();
    }
}
