import {DashboardWidget, DashboardWidgetInfo} from '../../dashboard.model';
import {Component, OnInit, Provider} from '@angular/core';
import {DashboardWidgetService} from '../../../../service/dashboard-service/dashboard-widget.service';
import {ChartType} from 'angular-google-charts';
import {MatSelectChange} from '@angular/material/select';
import {UserVisitsInsightWidgetService} from './user-visits-insight-widget.service';
import {take, tap} from 'rxjs/operators';

export type PERIOD_TYPE = 'daily' | 'weekly' | 'monthly' | 'yearly';

@Component({
   templateUrl: './user-visits-insight-widget.component.html',
   styleUrls: ['./user-visits-insight-widget.component.scss'],
   providers: [
      { provide: UserVisitsInsightWidgetService, useClass: UserVisitsInsightWidgetService } as Provider
   ]
})
export class UserVisitsInsightWidgetComponent extends DashboardWidget implements OnInit {

constructor(protected dashboardWidgetService: DashboardWidgetService,
            protected userVisitsInsightWidgetService: UserVisitsInsightWidgetService) {
      super(dashboardWidgetService);
      this.type = ChartType.LineChart;
      this.period = 'daily';
   }

   type: ChartType;
   period: PERIOD_TYPE;
   ALL_PERIODS: PERIOD_TYPE[] = ['daily', 'weekly', 'monthly', 'yearly'];

   data: any[][] = [];

   userVisitsInsight: {
       daily: {date: string, count: number}[],
       weekly: {date: string, count: number}[],
       monthly: {date: string, count: number}[],
       yearly: {date: string, count: number}[]
   };
   options: any = {
      title: 'User Visits Insights',
      is3D: true,
      width: 800,
      height: 400,
      legend: {
          position: 'bottom'
      },
      hAxis: {
           title: 'Visits'
      },
      vAxis: {
           title: 'Date'
      }
   };

    static info(): DashboardWidgetInfo {
        return { id: 'users-visits-insight-widget', name: 'user-visits-insight-widget', type: UserVisitsInsightWidgetComponent };
    }

   ngOnInit(): void {
       this.userVisitsInsightWidgetService.getUserVisitInsights().pipe(
           tap((r: {
              daily: {date: string, count: number}[],
              weekly: {date: string, count: number}[],
              monthly: {date: string, count: number}[],
              yearly: {date: string, count: number}[]
           }) => {
               this.userVisitsInsight = r;
               this.reload();
           })
       ).subscribe();
    }


   onPeriodChange($event: MatSelectChange) {
      this.period = $event.value;
      this.reload();
   }

   reload() {
       const d: any[][] = [];
       switch (this.period) {
           case 'daily': {
               this.userVisitsInsight.daily.map((i: {date: string, count: number}) => {
                   d.push([i.date, i.count]);
               });
               break;
           }
           case 'weekly': {
               this.userVisitsInsight.weekly.map((i: {date: string, count: number}) => {
                   d.push([i.date, i.count]);
               });
               break;
           }
           case 'monthly': {
               this.userVisitsInsight.monthly.map((i: {date: string, count: number}) => {
                   d.push([i.date, i.count]);
               });
               break;
           }
           case 'yearly': {
               this.userVisitsInsight.yearly.map((i: {date: string, count: number}) => {
                   d.push([i.date, i.count]);
               });
               break;
           }
       }
       this.data = d;
   }
}

