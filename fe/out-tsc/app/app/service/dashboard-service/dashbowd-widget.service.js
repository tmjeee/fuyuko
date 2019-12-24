import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
const MAP = {};
let DashboardWidgetService = class DashboardWidgetService {
    saveData(widgetInstance, data) {
        MAP[widgetInstance.instanceId] = data;
    }
    loadData(widgetInstance) {
        const r = MAP[widgetInstance.instanceId];
        return r;
    }
};
DashboardWidgetService = tslib_1.__decorate([
    Injectable()
], DashboardWidgetService);
export { DashboardWidgetService };
//# sourceMappingURL=dashbowd-widget.service.js.map