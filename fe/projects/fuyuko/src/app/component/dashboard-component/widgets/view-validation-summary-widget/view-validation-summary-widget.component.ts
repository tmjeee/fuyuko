import {Component, OnInit, Provider} from '@angular/core';
import {ViewValidationSummaryWidgetService} from './view-validation-summary-widget.service';
import {DashboardWidget, DashboardWidgetInfo} from '../../dashboard.model';
import {DashboardWidgetService} from '../../../../service/dashboard-service/dashboard-widget.service';
import {ViewService} from '../../../../service/view-service/view.service';
import {take, tap} from 'rxjs/operators';
import {Reporting_ViewValidationSummary} from '@fuyuko-common/model/reporting.model';
import {View} from '@fuyuko-common/model/view.model';
import {MatSelectChange} from '@angular/material/select';
import {ChartType} from 'angular-google-charts';


@Component({
   templateUrl: './view-validation-summary-widget.component.html',
   styleUrls: ['./view-validation-summary-widget.component.scss'],
   providers: [
      {provide: ViewValidationSummaryWidgetService, useClass: ViewValidationSummaryWidgetService} as Provider,
   ]
})
export class ViewValidationSummaryWidgetComponent extends DashboardWidget implements OnInit {

   constructor(protected dashboardWidgetService: DashboardWidgetService,
               protected viewService: ViewService,
               protected viewValidationSummaryWidgetService: ViewValidationSummaryWidgetService) {
      super(dashboardWidgetService);
   }

   selectedView?: View;
   views: View[] = [];
   r?: Reporting_ViewValidationSummary;

   data: any[] = [];

   options: any = {
       title: 'Validation Summary',
       is3D: true,
       width: 800,
       height: 400,
       legend: {
           position: 'bottom'
       },
       hAxis: {
           title: 'number'
       },
       vAxis: {
           title: 'validation result'
       }
   };
   type: ChartType = ChartType.PieChart;

   static info(): DashboardWidgetInfo {
       return { id: 'view-validation-summary-widget', name: 'view-validation-summary-widget', type: ViewValidationSummaryWidgetComponent };
   }

   ngOnInit(): void {
      // this.viewValidationSummaryWidgetService.getViewValidationSummary()
      this.viewService.getAllViews().pipe(
          take(1),
          tap((views: View[]) => {
             this.views = views;
             if (this.views && this.views.length) {
                 this.selectedView = this.views[0];
                 this.reload();
             }
          })
      ).subscribe();
   }

   onViewChange($event: MatSelectChange) {
      this.selectedView = $event.value;
      this.reload();
   }

   reload() {
       if (this.selectedView) {
           this.viewValidationSummaryWidgetService
               .getViewValidationSummary(this.selectedView.id)
               .pipe(
                   tap((r: Reporting_ViewValidationSummary) => {
                       this.r = r;
                       const d: any[] = [];
                       if (this.r && r.totalWithWarnings && r.totalWithErrors && r.totalItems) {
                           d.push(['Successful', Math.abs(this.r.totalItems - this.r.totalWithErrors - this.r.totalWithWarnings)]);
                           d.push(['Errors', this.r.totalWithErrors]);
                           d.push(['Warnings', this.r.totalWithWarnings]);
                       }
                       this.data = d;
                   })
               ).subscribe();
       }
   }
}
