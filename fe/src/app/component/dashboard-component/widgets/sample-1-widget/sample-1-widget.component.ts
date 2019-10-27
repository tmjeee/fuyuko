import {DashboardWidget, DashboardWidgetInfo} from '../../../../model/dashboard.model';
import {Component, OnInit} from '@angular/core';


@Component({
    templateUrl: './sample-1-widget.component.html',
    styleUrls: ['./sample-1-widget.component.scss']

})
export class Sample1WidgetComponent implements DashboardWidget, OnInit {

    id = Sample1WidgetComponent.info().id;
    name = Sample1WidgetComponent.info().name;

    date: Date;

    static info(): DashboardWidgetInfo {
        return { id: 'sample-1-widget', name: 'sample-1-widget name', type: Sample1WidgetComponent };
    }

    constructor() {
    }

    ngOnInit(): void {
        this.date = new Date();
    }


}
