import {Type} from '@angular/core';
import {DashboardWidgetService} from '../service/dashboard-service/dashbowd-widget.service';
import {SerializeInstanceFormat} from './dashboard-serialzable.model';


export interface DashboardStrategy {
    id: string;
    name: string;
    columnIndexes(): number[];
    addDashboardWidgetInstances(serializeInstanceFormats: SerializeInstanceFormat[]);
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

export interface DashboardWidgetInstance extends SerializeInstanceFormat {
    instanceId: string;
    typeId: string;
    type: Type<DashboardWidget>;
}

export interface DashboardWidgetInfo {
    id: string;
    name: string;
    type: Type<DashboardWidget>;
}


