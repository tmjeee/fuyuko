import {Component, OnInit, Provider} from "@angular/core";
import {MissingAttributeValueWidgetService} from "./missing-attribute-value-widget.service";
import {DashboardWidget, DashboardWidgetInfo} from "../../dashboard.model";
import {DashboardWidgetService} from "../../../../service/dashboard-service/dashboard-widget.service";
import {take, tap} from "rxjs/operators";
import {
    Reporting_ItemsWithMissingAttributeInfo, Reporting_ItemWithMissingAttribute,
    Reporting_ViewWithMissingAttribute
} from "../../../../model/reporting.model";
import {MatSelectChange} from "@angular/material/select";
import {ChartType} from "angular-google-charts";


@Component({
    templateUrl: './missing-attribute-value-widget.component.html',
    styleUrls: ['./missing-attribute-value-widget.component.scss'],
    providers: [
        { provide: MissingAttributeValueWidgetService, useClass: MissingAttributeValueWidgetService } as Provider
    ]
})
export class MissingAttributeValueWidgetComponent extends DashboardWidget implements OnInit {

    static info(): DashboardWidgetInfo {
        return { id: 'missing-attribute-value-widget', name: 'missing-attribute-value-widget', type: MissingAttributeValueWidgetComponent };
    }

    i: Reporting_ItemsWithMissingAttributeInfo;
    data: any[];
    selectedView: Reporting_ViewWithMissingAttribute;
    options = {
        title: `Number of missing values in view`,
        is3D: true,
        width: 800,
        height:400,
        legend: {
            position: 'bottom'
        },
        hAxis: {
            title: 'view'
        },
        vAxis: {
            title: `number of missing values`
        }
    };
    chartType: ChartType = ChartType.PieChart;

    constructor(protected dashboardWidgetService: DashboardWidgetService,
                protected missingAttributeValueWidgetService: MissingAttributeValueWidgetService) {
        super(dashboardWidgetService);
    }


    ngOnInit(): void {
        this.missingAttributeValueWidgetService
            .getMissingAttributeValues().pipe(
                take(1),
                tap((r: Reporting_ItemsWithMissingAttributeInfo) => {
                    this.i = r;
                    if (this.i.views && this.i.views.length) {
                        this.selectedView = this.i.views[0];
                    }
                })).subscribe()
    }

    onViewChange($event: MatSelectChange) {
        this.selectedView = $event.value;

        const d:any[] = [];
        this.selectedView.items.map((i: Reporting_ItemWithMissingAttribute) => {
            d.push([i.itemName, i.totalMissingAttributes]);
        });
        this.data = d;

        this.options = {
            title: `Number of missing values in ${this.selectedView.viewName}`,
            is3D: true,
            width: 800,
            height:400,
            legend: {
                position: 'bottom'
            },
            hAxis: {
                title: this.selectedView.viewName,
            },
            vAxis: {
                title: `Number of missing values`
            }
        };
    }
}