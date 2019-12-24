var Sample2WidgetComponent_1;
import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { DashboardWidget } from '../../../../model/dashboard.model';
import { DashboardWidgetService } from '../../../../service/dashboard-service/dashbowd-widget.service';
let Sample2WidgetComponent = Sample2WidgetComponent_1 = class Sample2WidgetComponent extends DashboardWidget {
    constructor(dashboardWidgetService) {
        super(dashboardWidgetService);
        this.id = Sample2WidgetComponent_1.info().id;
        this.name = Sample2WidgetComponent_1.info().name;
    }
    static info() {
        return { id: 'sample-2-widget', name: 'sample-2-widget name', type: Sample2WidgetComponent_1 };
    }
    ngOnInit() {
        this.data = '' + Math.random();
    }
    ngOnDestroy() {
        console.log('Sample2WidgetComponent destroy');
    }
};
Sample2WidgetComponent = Sample2WidgetComponent_1 = tslib_1.__decorate([
    Component({
        templateUrl: './sample-2-widget.component.html',
        styleUrls: ['./sample-2-widget.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [DashboardWidgetService])
], Sample2WidgetComponent);
export { Sample2WidgetComponent };
//# sourceMappingURL=sample-2-widget.component.js.map