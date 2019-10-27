import {Type} from '@angular/core';


export interface DashboardStrategy {
    id: string;
    name: string;
    columnIndexes(): number[];
    // addDashboardWidgetTypes(dashboardWidgetTypes: DashboardWidgetType[]);
    addDashboardWidgetTypes(dashboardWidgetTypes: Type<DashboardWidget>[]);
    // getDashboardWidgetTypesForColumn(columnIndex: number): DashboardWidgetType[];
    getDashboardWidgetTypesForColumn(columnIndex: number): Type<DashboardWidget>[];
}

export interface DataMap {
    [k: string]: string;
}


export interface DashboardWidget {
    id: string;
    name: string;
    // serializeData(d: DataMap);
    // deserializeData(): DataMap;
}

/*
export interface DashboardWidgetType {
    type: Type<DashboardWidget>;
    data: DataMap
}
 */

export interface DashboardWidgetInfo {
    id: string;
    name: string;
    type: Type<DashboardWidget>;
}


