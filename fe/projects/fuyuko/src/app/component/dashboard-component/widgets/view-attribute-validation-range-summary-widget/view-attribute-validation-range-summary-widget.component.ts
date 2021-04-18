import {Component, OnInit, Provider} from '@angular/core';
import {DashboardWidget, DashboardWidgetInfo} from '../../dashboard.model';
import {DashboardWidgetService} from '../../../../service/dashboard-service/dashboard-widget.service';
import {
   Reporting_ViewAttributeValidationRangeSummary,
} from '@fuyuko-common/model/reporting.model';
import {View} from '@fuyuko-common/model/view.model';
import {ChartType} from 'angular-google-charts';
import {ViewAttributeValidationRangeSummaryWidgetService} from './view-attribute-validation-range-summary-widget.service';
import {MatSelectChange} from '@angular/material/select';
import {tap} from 'rxjs/operators';
import {ViewService} from '../../../../service/view-service/view.service';


@Component({
   templateUrl: './view-attribute-validation-range-summary-widget.component.html',
   styleUrls: ['./view-attribute-validation-range-summary-widget.component.scss'],
   providers: [
      { provide: ViewAttributeValidationRangeSummaryWidgetService, useClass: ViewAttributeValidationRangeSummaryWidgetService } as Provider
   ]
})
export class ViewAttributeValidationRangeSummaryWidgetComponent extends DashboardWidget implements OnInit {

   constructor(protected dashboardWidgetService: DashboardWidgetService,
               protected viewService: ViewService,
               protected viewAttributeValidateRangeSummaryWidgetService: ViewAttributeValidationRangeSummaryWidgetService) {
       super(dashboardWidgetService);
   }

   data: any;
   r: Reporting_ViewAttributeValidationRangeSummary;
   views: View[];
   selectedView: View;

   columns: any[] = ['validation name', 'total attribute warnings', 'total attribute errors'];
   options: any = {
      title: 'Attribute Validation Range Summary',
      is3D: true,
      width: 800,
      height: 400,
      bars: 'horizontal',
      legend: {
         position: 'bottom'
      },
      hAxis: {
          viewWindow: {
              min: 0
          }
      }
   };
   type: ChartType = ChartType.BarChart;

   static info(): DashboardWidgetInfo {
      return { id: 'view-attribute-validation-range-summary-widget', name: 'view-attribute-validation-range-summary-widget', type: ViewAttributeValidationRangeSummaryWidgetComponent };
   }

   ngOnInit(): void {
      this.viewService.getAllViews().pipe(
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
      this.viewAttributeValidateRangeSummaryWidgetService
          .getViewAttributesValidationRangeSummary(this.selectedView.id)
          .pipe(
              tap((r: Reporting_ViewAttributeValidationRangeSummary) => {
                  this.r = r;
                  const d: any = [];

                  if (r && r.ranges && r.ranges.length) {
                      r.ranges.forEach((r: {
                          validationId: number,
                          validationName: string,
                          totalAttributeErrors: number,
                          totalAttributeWarnings: number
                      }) => {
                          d.push([r.validationName, r.totalAttributeWarnings, r.totalAttributeErrors]);
                      });
                  }
                  this.data = d;
              })
          ).subscribe();
   }
}
