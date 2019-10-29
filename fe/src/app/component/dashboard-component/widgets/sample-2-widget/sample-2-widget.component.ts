import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardWidget, DashboardWidgetInfo} from '../../../../model/dashboard.model';
import {DashboardWidgetService} from '../../../../service/dashboard-service/dashbowd-widget.service';


@Component({
    templateUrl: './sample-2-widget.component.html',
    styleUrls: ['./sample-2-widget.component.scss']
})
export class Sample2WidgetComponent extends DashboardWidget implements OnInit, OnDestroy {

    id = Sample2WidgetComponent.info().id;
    name = Sample2WidgetComponent.info().name;

    data: string;

    static info(): DashboardWidgetInfo {
        return { id: 'sample-2-widget', name: 'sample-2-widget name', type: Sample2WidgetComponent };
    }

    constructor(dashboardWidgetService: DashboardWidgetService) {
        super(dashboardWidgetService);
    }

    ngOnInit(): void {
        this.data = '' + Math.random();
    }

    ngOnDestroy(): void {
        console.log('Sample2WidgetComponent destroy');
    }

}
