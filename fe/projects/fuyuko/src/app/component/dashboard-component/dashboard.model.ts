import {Type} from '@angular/core';
import {DashboardWidgetService} from '../../service/dashboard-service/dashboard-widget.service';
import {DataMap, SerializedDashboardWidgetInstanceFormat} from '@fuyuko-common/model/dashboard-serialzable.model';
import {Observable} from 'rxjs';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


export interface DashboardStrategy {
    id: string;
    name: string;
    columnIndexes(): number[];
    addDashboardWidgetInstances(serializeInstanceFormats: SerializedDashboardWidgetInstanceFormat[]): void;
    removeDashboardWidgetInstances(instanceIds: string[]): void;
    getDashboardWidgetInstancesForColumn(columnIndex: number): DashboardWidgetInstance[];
    serialize(): string;
    deserialize(data: string): void;
    moveDashboardWidgetInstances(columnIndex: number, previousIndex: number, currentIndex: number): void;
    transferDashboardWidgetInstances(previousColumnIndex: number, currentColumnIndex: number,
                                     previousIndex: number, currentIndex: number): void;
}

export abstract class DashboardWidget {
    id: string;
    name: string;

    constructor(protected dashboardWidgetService: DashboardWidgetService) { }

    saveData(data: DataMap): Observable<ApiResponse> {
       return this.dashboardWidgetService.saveData(data);
    }

    loadData(): Observable<DataMap> {
        return this.dashboardWidgetService.loadData();
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


