import {Type} from '@angular/core';
import {DashboardWidgetService} from '../service/dashboard-service/dashbowd-widget.service';
import {DataMap, SerializedDashboardWidgetInstanceFormat} from './dashboard-serialzable.model';
import {Observable} from 'rxjs';


export interface DashboardStrategy {
    id: string;
    name: string;
    columnIndexes(): number[];
    addDashboardWidgetInstances(serializeInstanceFormats: SerializedDashboardWidgetInstanceFormat[]);
    removeDashboardWidgetInstances(instanceIds: string[]);
    getDashboardWidgetInstancesForColumn(columnIndex: number): DashboardWidgetInstance[];
    serialize(): string;
    deserialize(data: string);
    moveDashboardWidgetInstances(columnIndex: number, previousIndex: number, currentIndex: number): void;
    transferDashboardWidgetInstances(previousColumnIndex: number, currentColumnIndex: number,
                                     previousIndex: number, currentIndex: number): void;
}

export class DashboardWidget {
    id: string;
    name: string;

    constructor(protected dashboardWidgetService: DashboardWidgetService) { }

    saveData(userId: number, widgetInstance: DashboardWidgetInstance, data: DataMap): Observable<boolean> {
       return this.saveData(userId, widgetInstance, data);
    }

    loadData(userId: number, widgetInstance: DashboardWidgetInstance): Observable<DataMap> {
        return this.dashboardWidgetService.loadData(userId, widgetInstance);
    }
}

export interface DashboardWidgetInstance extends SerializedDashboardWidgetInstanceFormat {
    instanceId: string;
    typeId: string;
    type: Type<DashboardWidget>;
}

export interface DashboardWidgetInfo {
    id: string;
    name: string;
    type: Type<DashboardWidget>;
}


