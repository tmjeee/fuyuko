import {Component, OnInit, Provider} from "@angular/core";
import {DashboardWidget, DashboardWidgetInfo} from "../../dashboard.model";
import {MostActiveUsersWidgetService} from "./most-active-users-widget.service";
import config from "../../../../utils/config.util";
import {HttpClient} from "@angular/common/http";
import {DashboardWidgetService} from "../../../../service/dashboard-service/dashboard-widget.service";
import {Reporting_ActiveUser, Reporting_MostActiveUsers} from "../../../../model/reporting.model";
import {tap} from "rxjs/operators";
import {ChartType} from "angular-google-charts";


@Component({
    templateUrl: './most-active-users-widget.component.html',
    styleUrls: ['./most-active-users-widget.component.scss'],
    providers: [
        { provide: MostActiveUsersWidgetService, useClass: MostActiveUsersWidgetService } as Provider
    ]
})
export class MostActiveUsersWidgetComponent extends DashboardWidget implements OnInit{

    static info(): DashboardWidgetInfo {
        return { id: 'most-active-users-widget', name: 'most-active-users-widget', type: MostActiveUsersWidgetComponent };
    }

    type: ChartType;
    mostActiveUsers: Reporting_MostActiveUsers;
    data: any[][] = [];
    options: any = {
        title: 'Most Active Users',
        is3D: true,
        width: 800,
        height:400,
        legend: {
            position: 'bottom'
        },
        hAxis: {
            title: 'Username'
        },
        vAxis: {
            title: 'Logins'
        }
    };

    constructor(protected mostActiveUsersWidgetService: MostActiveUsersWidgetService,
                protected  dashboardWidgetService: DashboardWidgetService) {
        super(dashboardWidgetService);
        this.type = ChartType.PieChart;
    }

    ngOnInit(): void {
        const d: any[][] = [];
        this.mostActiveUsersWidgetService.getActiveUsersInfo().pipe(
            tap((r: Reporting_MostActiveUsers) => {
                this.mostActiveUsers = r;
                this.mostActiveUsers.activeUsers.map((a: Reporting_ActiveUser) => {
                    d.push([ a.username, a.count ]);
                });
                this.data = d;
            })
        ).subscribe();
    }
}