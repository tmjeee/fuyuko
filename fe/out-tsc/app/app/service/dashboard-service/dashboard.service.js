import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Sample1WidgetComponent } from '../../component/dashboard-component/widgets/sample-1-widget/sample-1-widget.component';
import { Sample2WidgetComponent } from '../../component/dashboard-component/widgets/sample-2-widget/sample-2-widget.component';
import { of } from 'rxjs';
// a must be array / multi-dimention array of SerializeInstanceFormat
const stickInTypes = (a) => {
    if (Array.isArray(a)) {
        const ar = a;
        for (const ai of ar) {
            stickInTypes(ai);
        }
    }
    else {
        const d = a;
        const wi = DASHBOARD_WIDGET_INFOS.find((i) => i.id === d.typeId);
        if (wi) {
            d.type = wi.type;
        }
        else {
            console.error(`DashboardWidgetInstance instanceId ${d.instanceId} of typeId ${d.typeId} is an invalid entry, cannot identify the type`);
        }
    }
};
export class DashboardStrategy1x {
    constructor() {
        this.id = '1x';
        this.name = '1x Layout';
        this.dashboardWidgetInstances = [];
    }
    columnIndexes() {
        return [0];
    }
    getDashboardWidgetInstancesForColumn(columnIndex) {
        return this.dashboardWidgetInstances;
    }
    addDashboardWidgetInstances(serializeInstanceFormats) {
        serializeInstanceFormats.forEach((t) => {
            const dashboardWidgetInfo = DASHBOARD_WIDGET_INFOS.find((dwi) => dwi.id === t.typeId);
            this.dashboardWidgetInstances.push({
                instanceId: t.instanceId,
                typeId: t.typeId,
                type: dashboardWidgetInfo.type
            });
        });
    }
    serialize() {
        const strategyId = this.id;
        const data = JSON.stringify({
            strategyId: this.id,
            instances: this.dashboardWidgetInstances,
            special: undefined
        });
        return data;
    }
    deserialize(data) {
        this.dashboardWidgetInstances = [];
        const x = JSON.parse(data);
        const r = x.instances;
        stickInTypes(r);
        this.addDashboardWidgetInstances(r);
    }
}
export class DashboardStrategy2x {
    constructor() {
        this.id = '2x';
        this.name = '2x Layout';
        this.NUM = 2;
        this.i = 0;
        this.dashboardWidgetInstances = [[], []];
    }
    columnIndexes() {
        return [0, 1];
    }
    getDashboardWidgetInstancesForColumn(columnIndex) {
        return this.dashboardWidgetInstances[columnIndex % this.NUM];
    }
    addDashboardWidgetInstances(serializeInstanceFormats) {
        serializeInstanceFormats.forEach((t) => {
            const dashboardWidgetInfo = DASHBOARD_WIDGET_INFOS.find((dwi) => dwi.id === t.typeId);
            this.dashboardWidgetInstances[this.i % this.NUM].push({
                instanceId: t.instanceId,
                typeId: t.typeId,
                type: dashboardWidgetInfo.type
            });
            this.i += 1;
        });
    }
    serialize() {
        const strategyId = this.id;
        const data = JSON.stringify({
            strategyId,
            instances: [...this.dashboardWidgetInstances[0], ...this.dashboardWidgetInstances[1]],
            special: this.dashboardWidgetInstances
        });
        return data;
    }
    deserialize(data) {
        this.dashboardWidgetInstances = [[], []];
        this.i = 0;
        const strategyId = this.id;
        const x = JSON.parse(data);
        if (x.strategyId === strategyId) { // deserializing from same strategy id
            stickInTypes(x.special);
            this.dashboardWidgetInstances = x.special;
        }
        else {
            stickInTypes(x.instances);
            this.addDashboardWidgetInstances(x.instances);
        }
    }
}
export const DASHBOARD_STRATEGIES = [
    new DashboardStrategy1x(),
    new DashboardStrategy2x()
];
export const DASHBOARD_WIDGET_INFOS = [
    Sample1WidgetComponent.info(),
    Sample2WidgetComponent.info(),
];
let DashboardService = class DashboardService {
    constructor() {
        this.serializedData = JSON.stringify({
            strategyId: '2x',
            instances: [
                { instanceId: '1', typeId: Sample1WidgetComponent.info().id },
                { instanceId: '2', typeId: Sample1WidgetComponent.info().id },
                { instanceId: '3', typeId: Sample2WidgetComponent.info().id },
                { instanceId: '4', typeId: Sample2WidgetComponent.info().id },
            ],
            special: [
                [
                    { instanceId: '1', typeId: Sample1WidgetComponent.info().id },
                    { instanceId: '2', typeId: Sample1WidgetComponent.info().id },
                ],
                [
                    { instanceId: '3', typeId: Sample2WidgetComponent.info().id },
                    { instanceId: '4', typeId: Sample2WidgetComponent.info().id },
                ]
            ]
        });
    }
    getAllDashboardStrategies() {
        return [...DASHBOARD_STRATEGIES];
    }
    getAllDashboardWidgetInfos() {
        return [...DASHBOARD_WIDGET_INFOS];
    }
    getUserDashboardLayoutData(myself) {
        return this.serializedData;
    }
    saveDashboardLayout(serializeData) {
        this.serializedData = serializeData;
        return of(true);
    }
};
DashboardService = tslib_1.__decorate([
    Injectable()
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map