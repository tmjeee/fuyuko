var Sample1WidgetComponent_1;
import * as tslib_1 from "tslib";
import { DashboardWidget } from '../../../../model/dashboard.model';
import { Component } from '@angular/core';
import { DashboardWidgetService } from '../../../../service/dashboard-service/dashbowd-widget.service';
let Sample1WidgetComponent = Sample1WidgetComponent_1 = class Sample1WidgetComponent extends DashboardWidget {
    constructor(dashboardWidgetService) {
        super(dashboardWidgetService);
        this.id = Sample1WidgetComponent_1.info().id;
        this.name = Sample1WidgetComponent_1.info().name;
    }
    static info() {
        return { id: 'sample-1-widget', name: 'sample-1-widget name', type: Sample1WidgetComponent_1 };
    }
    ngOnInit() {
        this.date = new Date();
    }
};
Sample1WidgetComponent = Sample1WidgetComponent_1 = tslib_1.__decorate([
    Component({
        templateUrl: './sample-1-widget.component.html',
        styleUrls: ['./sample-1-widget.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [DashboardWidgetService])
], Sample1WidgetComponent);
export { Sample1WidgetComponent };
//# sourceMappingURL=sample-1-widget.component.js.map