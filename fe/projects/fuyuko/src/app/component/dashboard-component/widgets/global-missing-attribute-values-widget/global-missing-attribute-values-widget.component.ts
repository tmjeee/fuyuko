import {Component, OnInit} from '@angular/core';
import {DashboardWidget, DashboardWidgetInfo} from '../../dashboard.model';
import {DashboardWidgetService} from '../../../../service/dashboard-service/dashboard-widget.service';
import {GlobalMissingAttributeValuesWidgetService} from './global-missing-attribute-values-widget.service';
import {tap} from 'rxjs/operators';
import {
    Reporting_ItemsWithMissingAttributeInfo,
    Reporting_ViewWithMissingAttribute
} from '@fuyuko-common/model/reporting.model';
import {MatSelectChange} from '@angular/material/select';
import {ChartType} from 'angular-google-charts';

export type Type = 'Item' | 'Attribute';

@Component({
    templateUrl: './global-missing-attribute-values-widget.component.html',
    styleUrls: ['./global-missing-attribute-values-widget.component.scss'],
    providers: [
        {provide: GlobalMissingAttributeValuesWidgetService, useClass: GlobalMissingAttributeValuesWidgetService}
    ]
})
export class GlobalMissingAttributeValuesWidgetComponent extends DashboardWidget implements OnInit {

    constructor(protected dashboardWidgetService: DashboardWidgetService,
                protected globalMissingAttributeValuesWidgetService: GlobalMissingAttributeValuesWidgetService) {
        super(dashboardWidgetService);
    }

    i?: Reporting_ItemsWithMissingAttributeInfo;
    types: Type[] = ['Item', 'Attribute'];
    selectedType: Type = 'Item';

    data: any[] = [];
    chartType: ChartType = ChartType.PieChart;
    options: any = {
        title: `Number of ${this.selectedType} with missing values`,
        is3D: true,
        width: 800,
        height: 400,
        legend: {
            position: 'bottom'
        },
        hAxis: {
            title: this.selectedType,
        },
        vAxis: {
            title: `Number of ${this.selectedType}`
        }
    };

    static info(): DashboardWidgetInfo {
        return {
            id: 'global-missing-attribute-values-widget',
            name: 'global-missing-attribute-values-widget',
            type: GlobalMissingAttributeValuesWidgetComponent
        };
    }

    ngOnInit(): void {
        this.globalMissingAttributeValuesWidgetService
            .getMissingAttributeValues().pipe(
                tap((r: Reporting_ItemsWithMissingAttributeInfo) => {
                    this.i = r;
                    this.reload();
                })
            ).subscribe();
    }


    onTypeChange($event: MatSelectChange) {
        this.selectedType = $event.value;
        this.reload();
    }

    reload() {
        const d: any = [];
        if (this.i) {
            switch (this.selectedType) {
                case 'Item': {
                    this.i.views.forEach((v: Reporting_ViewWithMissingAttribute) => {
                        d.push([v.viewName, v.totalItemsWithMissingAttributes]);
                    });
                    this.data = d;
                    break;
                }
                case 'Attribute': {
                    this.i.views.forEach((v: Reporting_ViewWithMissingAttribute) => {
                        d.push([v.viewName, v.totalMissingAttributes]);
                    });
                    this.data = d;
                    break;
                }
            }
        }
        this.options = {
            title: `Number of ${this.selectedType} with missing values`,
            is3D: true,
            width: 800,
            height: 400,
            legend: {
                position: 'bottom'
            },
            hAxis: {
                title: this.selectedType,
            },
            vAxis: {
                title: `Number of ${this.selectedType}`
            }
        };
    }
}
