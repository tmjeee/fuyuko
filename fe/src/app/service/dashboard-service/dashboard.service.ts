import {Injectable, Type} from '@angular/core';
import {DashboardStrategy, DashboardWidget, DashboardWidgetInfo} from '../../model/dashboard.model';
import {Sample1WidgetComponent} from '../../component/dashboard-component/widgets/sample-1-widget/sample-1-widget.component';
import {User} from '../../model/user.model';
import {Sample2WidgetComponent} from '../../component/dashboard-component/widgets/sample-2-widget/sample-2-widget.component';


export class DashboardStrategy1x implements DashboardStrategy {
    id: '1x';
    name = '1x Layout';
    dashboardWidgetTypes: Type<DashboardWidget>[] = [];

    columnIndexes(): number[] {
        return [0];
    }
    // getDashboardWidgetTypesForColumn(columnIndex: number): DashboardWidgetType[] {
    getDashboardWidgetTypesForColumn(columnIndex: number): Type<DashboardWidget>[] {
        return this.dashboardWidgetTypes;
    }
    // addDashboardWidgetTypes(dashboardWidgetTypes: DashboardWidgetType[]) {
    addDashboardWidgetTypes(dashboardWidgetTypes: Type<DashboardWidget>[]) {
        this.dashboardWidgetTypes.push(...dashboardWidgetTypes);
    }
}

export class DashboardStrategy2x implements DashboardStrategy {
    id: '2x';
    name = '2x Layout';
    NUM = 2;
    i = 0;
    dashboardWidgetTypes: Type<DashboardWidget>[][] = [[], []];
    // dashboardWidgetTypes: DashboardWidgetType[][] = [[], []];

    columnIndexes(): number[] {
        return [0, 1];
    }
    // getDashboardWidgetTypesForColumn(columnIndex: number): DashboardWidgetType[] {
    getDashboardWidgetTypesForColumn(columnIndex: number): Type<DashboardWidget>[] {
        return this.dashboardWidgetTypes[columnIndex % this.NUM];
    }
    // addDashboardWidgetTypes(dashboardWidgetTypes: DashboardWidgetType[]) {
    addDashboardWidgetTypes(dashboardWidgetTypes: Type<DashboardWidget>[]) {
        dashboardWidgetTypes.forEach((t: Type<DashboardWidget>) => {
            this.dashboardWidgetTypes[this.i % this.NUM].push(t);
            this.i += 1;
        });
    }
}

const DASHBOARD_STRATEGIES = [
    new DashboardStrategy1x(),
    new DashboardStrategy2x()
];


const DASHBOARD_WIDGET_INFOS = [
    Sample1WidgetComponent.info(),
    Sample2WidgetComponent.info(),
];





@Injectable()
export class DashboardService {

    getAllDashboardStrategies(): DashboardStrategy[] {
        return [...DASHBOARD_STRATEGIES];
    }


    getAllDashboardWidgetInfos(): DashboardWidgetInfo[] {
        return [...DASHBOARD_WIDGET_INFOS];
    }

    // getUserDashboardWidgetTypes(myself: User): DashboardWidgetType {
    //      return [
    //          {type: Sample1WidgetComponent, data: {}},
    //          {type: Sample1WidgetComponent, data: {}},
    //          {type: Sample2WidgetComponent, data: {}},
    //          {type: Sample2WidgetComponent, data: {}},
    //      ];
    // }
    getUserDashboardWidgetTypes(myself: User): Type<DashboardWidget>[] {
        return [
            Sample1WidgetComponent,
            Sample1WidgetComponent,
            Sample2WidgetComponent,
            Sample2WidgetComponent
        ];
    }
}
