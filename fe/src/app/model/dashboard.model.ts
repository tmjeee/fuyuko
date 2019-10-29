import {Type} from '@angular/core';
import {DashboardWidgetService} from '../service/dashboard-service/dashbowd-widget.service';

export interface SerializeFormat {
    strategyId: string;
    instances: DashboardWidgetInstance[];
    special: any;
}

export interface DashboardStrategy {
    id: string;
    name: string;
    columnIndexes(): number[];
    addDashboardWidgetInstances(dashboardWidgetInsances: DashboardWidgetInstance[]);
    getDashboardWidgetInstancesForColumn(columnIndex: number): DashboardWidgetInstance[];
    serialize(): string;
    deserialize(data: string);
}

export interface DataMap {
    [k: string]: string;
}


export class DashboardWidget {
    id: string;
    name: string;

    constructor(protected dashboardWidgetService: DashboardWidgetService) { }

    saveData(widgetInstance: DashboardWidgetInstance, data: DataMap) {
       this.saveData(widgetInstance, data);
    }

    loadData(widgetInstance: DashboardWidgetInstance): DataMap {
        return this.dashboardWidgetService.loadData(widgetInstance);
    }
}

export interface DashboardWidgetInstance {
    instanceId: string;
    typeId: string;
    type: Type<DashboardWidget>;
}

export interface DashboardWidgetInfo {
    id: string;
    name: string;
    type: Type<DashboardWidget>;
}


