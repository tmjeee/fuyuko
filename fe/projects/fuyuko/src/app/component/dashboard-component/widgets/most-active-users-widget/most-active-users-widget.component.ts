import {Component, OnInit, Provider} from '@angular/core';
import {DashboardWidget, DashboardWidgetInfo} from '../../dashboard.model';
import {MostActiveUsersWidgetService} from './most-active-users-widget.service';
import {DashboardWidgetService} from '../../../../service/dashboard-service/dashboard-widget.service';
import {Reporting_ActiveUser, Reporting_MostActiveUsers} from '@fuyuko-common/model/reporting.model';
import {tap} from 'rxjs/operators';
import {ChartType} from 'angular-google-charts';
import uuid from 'uuid';


@Component({
    templateUrl: './most-active-users-widget.component.html',
    styleUrls: ['./most-active-users-widget.component.scss'],
    providers: [
        { provide: MostActiveUsersWidgetService, useClass: MostActiveUsersWidgetService } as Provider
    ]
})
export class MostActiveUsersWidgetComponent extends DashboardWidget implements OnInit{

    constructor(protected mostActiveUsersWidgetService: MostActiveUsersWidgetService,
                protected  dashboardWidgetService: DashboardWidgetService) {
        super(dashboardWidgetService);
        this.type = ChartType.PieChart;
    }

    uid: string = uuid();

    type: ChartType;
    mostActiveUsers: Reporting_MostActiveUsers;
    data: any[][] = [];
    options: any = {
        title: 'Most Active Users',
        is3D: true,
        width: 800,
        height: 400,
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

    static info(): DashboardWidgetInfo {
        return { id: 'most-active-users-widget', name: 'most-active-users-widget', type: MostActiveUsersWidgetComponent };
    }

    ngOnInit(): void {
        const d: any[][] = [];
        this.mostActiveUsersWidgetService.getActiveUsersInfo().pipe(
            tap((r: Reporting_MostActiveUsers) => {
                this.mostActiveUsers = r;
                // this.doDraw();
                this.mostActiveUsers.activeUsers.map((a: Reporting_ActiveUser) => {
                    d.push([ a.username, a.count ]);
                });
                this.data = d;
            })
        ).subscribe();
    }

    /*
    doDraw() {
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawChart.bind(this));
    }

    drawChart() {
        const d = [];
        d.push(['Username', 'Access']);
        this.mostActiveUsers.activeUsers.forEach((a: Reporting_ActiveUser) => {
            d.push([a.username, a.count]);
        });

        const data = google.visualization.arrayToDataTable([ d ]);
        const options = {
            title: 'Most Active Users'
        };

        var chart = new google.visualization.PieChart(document.getElementById(this.uid));
        chart.draw(data, options);
    }
     */
}
