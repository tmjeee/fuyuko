import {Component, OnInit} from '@angular/core';
import {DashboardWidget, DashboardWidgetInfo} from '../../../../model/dashboard.model';


@Component({
    templateUrl: './sample-2-widget.component.html',
    styleUrls: ['./sample-2-widget.component.scss']
})
export class Sample2WidgetComponent implements DashboardWidget, OnInit {

    id = Sample2WidgetComponent.info().id;
    name = Sample2WidgetComponent.info().name;

    data: string;

    static info(): DashboardWidgetInfo {
        return { id: 'sample-2-widget', name: 'sample-2-widget name', type: Sample2WidgetComponent };
    }

    constructor() {
    }

    ngOnInit(): void {
        this.data = '' + Math.random();
    }

}
