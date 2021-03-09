import {Component, OnInit, Provider} from '@angular/core';
import {DashboardWidget, DashboardWidgetInfo} from '../../dashboard.model';
import {DashboardWidgetService} from '../../../../service/dashboard-service/dashboard-widget.service';
import {ViewValidationRangeSummaryWidgetService} from './view-validation-range-summary-widget.service';
import {View} from '@fuyuko-common/model/view.model';
import {Reporting_ViewValidationRangeSummary, Reporting_ViewValidationSummary} from '@fuyuko-common/model/reporting.model';
import {ChartType} from 'angular-google-charts';
import {take, tap} from 'rxjs/operators';
import {MatSelectChange} from '@angular/material/select';
import {ViewService} from '../../../../service/view-service/view.service';


@Component({
    templateUrl: './view-validation-range-summary-widget.component.html',
    styleUrls: ['./view-validation-range-summary-widget.component.scss'],
    providers: [
        { provide: ViewValidationRangeSummaryWidgetService, useClass: ViewValidationRangeSummaryWidgetService} as Provider,
    ]
})
export class ViewValidationRangeSummaryWidgetComponent extends DashboardWidget implements OnInit {

    constructor(protected dashboardWidgetService: DashboardWidgetService,
                protected viewService: ViewService,
                protected viewValidationRangeSummaryWidgetService: ViewValidationRangeSummaryWidgetService) {
       super(dashboardWidgetService);
    }

    selectedView: View;
    views: View[] = [];
    r: Reporting_ViewValidationRangeSummary;

    data: any[] = [];
    columns: any[] = ['validation name', 'success', 'error', 'warning'];

    options: any = {
        title: 'Validation Range Summary',
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
        return { id: 'view-validation-range-summary-widget', name: 'view-validation-range-summary-widget', type: ViewValidationRangeSummaryWidgetComponent };
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
        this.viewValidationRangeSummaryWidgetService
            .getViewValidationRangeSummary(this.selectedView.id)
            .pipe(
                tap((r: Reporting_ViewValidationRangeSummary) => {
                    this.r = r;
                    const d: any[] = [];
                    if (this.r && this.r.range && this.r.range.length) {
                        for (const _r of r.range) {
                            d.push([
                                _r.validationName,
                                Math.abs(_r.totalItems - _r.totalWithWarnings - _r.totalWithErrors),
                                (_r.totalWithErrors),
                                (_r.totalWithWarnings)
                            ]);
                        }
                    }
                    this.data = d;
                })
            ).subscribe();
    }

}
