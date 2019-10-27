import {Component, OnInit, Type} from '@angular/core';
import {DashboardService} from '../../service/dashboard-service/dashboard.service';
import {DashboardStrategy, DashboardWidget, DashboardWidgetInfo} from '../../model/dashboard.model';
import {AuthService} from '../../service/auth-service/auth.service';
import {User} from '../../model/user.model';


@Component({
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent implements OnInit {
    strategies: DashboardStrategy[];
    selectedStrategy: DashboardStrategy;
    dashboardWidgetInfos: DashboardWidgetInfo[];
    dashboardWidgetTypes: Type<DashboardWidget>[];

    constructor(private dashboardService: DashboardService,
                private authService: AuthService) {}

    ngOnInit(): void {
        this.strategies = this.dashboardService.getAllDashboardStrategies();
        this.selectedStrategy = this.strategies[1];

        this.dashboardWidgetInfos = this.dashboardService.getAllDashboardWidgetInfos();

        const myself: User = this.authService.myself();
        this.dashboardWidgetTypes = this.dashboardService.getUserDashboardWidgetTypes(myself);

        console.log('****** ', this.dashboardWidgetTypes);
    }

}
