import {Component, OnInit, Provider} from "@angular/core";
import {ViewAttributeValidationSummaryWidgetService} from "./view-attribute-validation-summary-widget.service";
import {DashboardWidget, DashboardWidgetInfo} from "../../dashboard.model";
import {DashboardWidgetService} from "../../../../service/dashboard-service/dashboard-widget.service";
import {take, tap} from "rxjs/operators";
import {View} from "../../../../model/view.model";
import {ViewService} from "../../../../service/view-service/view.service";
import {Reporting_ViewAttributeValidationSummary} from "../../../../model/reporting.model";
import {ChartType} from "angular-google-charts";
import {MatSelectChange} from "@angular/material/select";

@Component({
    templateUrl: './view-attribute-validation-summary-widget.component.html',
    styleUrls: ['./view-attribute-validation-summary-widget.component.scss'],
    providers: [
        {provide: ViewAttributeValidationSummaryWidgetService, useClass: ViewAttributeValidationSummaryWidgetService} as Provider
    ]
})
export class ViewAttributeValidationSummaryWidgetComponent extends DashboardWidget implements OnInit {

    static info(): DashboardWidgetInfo {
        return { id: 'view-attribute-validation-summary-widget', name: 'view-attribute-validation-summary-widget', type: ViewAttributeValidationSummaryWidgetComponent };
    }

    data: any;
    r: Reporting_ViewAttributeValidationSummary;
    views: View[];
    selectedView: View;

    columns: any[] = ['attribute name', 'warning', 'errors'];
    options: any = {
        title: 'Attribute Validation Summary',
        is3D: true,
        width: 800,
        height:400,
        bars: 'horizontal',
        legend: {
            position: 'bottom'
        },
    };
    type: ChartType = ChartType.BarChart;

    constructor(protected dashboardWidgetService: DashboardWidgetService,
                protected viewService: ViewService,
                protected viewAttributeValidationSummaryWidgetService: ViewAttributeValidationSummaryWidgetService) {
        super(dashboardWidgetService);
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


    reload() {
        this.viewAttributeValidationSummaryWidgetService.getViewValidationSummary(this.selectedView.id)
            .pipe(
                tap((r: Reporting_ViewAttributeValidationSummary) => {
                    this.r = r;
                    const d: any = [];
                    r.attributes.forEach((a: {
                        attributeId: number, attributeName: string, errors: number, warnings: number
                    }) => {
                        d.push([a.attributeName, a.warnings, a.errors])
                    });
                    this.data = d;
                })
            ).subscribe()
    }


    onViewChange($event: MatSelectChange) {
        this.selectedView = $event.value;
        this.reload();
    }
}