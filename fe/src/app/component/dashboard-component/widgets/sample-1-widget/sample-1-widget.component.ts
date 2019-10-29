import {DashboardWidget, DashboardWidgetInfo} from '../../../../model/dashboard.model';
import {Component, OnInit} from '@angular/core';
import {DashboardWidgetService} from "../../../../service/dashboard-service/dashbowd-widget.service";


@Component({
    templateUrl: './sample-1-widget.component.html',
    styleUrls: ['./sample-1-widget.component.scss']

})
export class Sample1WidgetComponent extends DashboardWidget implements OnInit {

    id = Sample1WidgetComponent.info().id;
    name = Sample1WidgetComponent.info().name;

    date: Date;

    static info(): DashboardWidgetInfo {
        return { id: 'sample-1-widget', name: 'sample-1-widget name', type: Sample1WidgetComponent };
    }

    constructor(dashboardWidgetService: DashboardWidgetService) {
        super(dashboardWidgetService);
    }

    ngOnInit(): void {
        this.date = new Date();
    }


}
