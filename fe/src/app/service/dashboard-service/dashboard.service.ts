import {Injectable } from '@angular/core';
import {
    DashboardStrategy,
    DashboardWidgetInfo,
    DashboardWidgetInstance,
} from '../../model/dashboard.model';
import {Sample1WidgetComponent} from '../../component/dashboard-component/widgets/sample-1-widget/sample-1-widget.component';
import {User} from '../../model/user.model';
import {Sample2WidgetComponent} from '../../component/dashboard-component/widgets/sample-2-widget/sample-2-widget.component';
import {Observable, of} from 'rxjs';
import {SerializeFormat, SerializeInstanceFormat} from '../../model/dashboard-serialzable.model';


// a must be array / multi-dimention array of SerializeInstanceFormat
const stickInTypes = (a: SerializeInstanceFormat| SerializeInstanceFormat[] | SerializeInstanceFormat[][]) => {
    if (Array.isArray(a)) {
        const ar: SerializeInstanceFormat[] = a as SerializeInstanceFormat[];
        for (const ai of ar) {
            stickInTypes(ai);
        }
    } else  {
       const d: SerializeInstanceFormat =  a as SerializeInstanceFormat;
       const wi: DashboardWidgetInfo = DASHBOARD_WIDGET_INFOS.find((i: DashboardWidgetInfo) => i.id === d.typeId);
       if (wi) {
           (d as any).type = wi.type;
       } else {
          console.error(
              `DashboardWidgetInstance instanceId ${d.instanceId} of typeId ${d.typeId} is an invalid entry, cannot identify the type`);
       }
    }
};


export class DashboardStrategy1x implements DashboardStrategy {
    id = '1x';
    name = '1x Layout';
    dashboardWidgetInstances: DashboardWidgetInstance[] = [];

    columnIndexes(): number[] {
        return [0];
    }
    getDashboardWidgetInstancesForColumn(columnIndex: number): DashboardWidgetInstance[] {
        return this.dashboardWidgetInstances;
    }
    addDashboardWidgetInstances(serializeInstanceFormats: SerializeInstanceFormat[]) {
        serializeInstanceFormats.forEach((t: SerializeInstanceFormat) => {
            const dashboardWidgetInfo: DashboardWidgetInfo = DASHBOARD_WIDGET_INFOS.find((dwi: DashboardWidgetInfo) => dwi.id === t.typeId);
            this.dashboardWidgetInstances.push({
                instanceId: t.instanceId,
                typeId: t.typeId,
                type: dashboardWidgetInfo.type
            } as DashboardWidgetInstance);
        });
    }
    serialize(): string {
        const strategyId = this.id;
        const data: string =  JSON.stringify({
            strategyId: this.id,
            instances: this.dashboardWidgetInstances,
            special: undefined
        } as SerializeFormat);
        return data;
    }
    deserialize(data: string) {
        this.dashboardWidgetInstances = [];
        const x: SerializeFormat = JSON.parse(data);
        const r: SerializeInstanceFormat[] = x.instances;
        stickInTypes(r);
        this.addDashboardWidgetInstances(r);
    }
}

export class DashboardStrategy2x implements DashboardStrategy {
    id = '2x';
    name = '2x Layout';
    NUM = 2;

    i = 0;
    dashboardWidgetInstances: DashboardWidgetInstance[][] = [[], []];

    columnIndexes(): number[] {
        return [0, 1];
    }
    getDashboardWidgetInstancesForColumn(columnIndex: number): DashboardWidgetInstance[] {
        return this.dashboardWidgetInstances[columnIndex % this.NUM];
    }
    addDashboardWidgetInstances(serializeInstanceFormats: SerializeInstanceFormat[]) {
        serializeInstanceFormats.forEach((t: SerializeInstanceFormat) => {
            const dashboardWidgetInfo: DashboardWidgetInfo = DASHBOARD_WIDGET_INFOS.find((dwi: DashboardWidgetInfo) => dwi.id === t.typeId);
            this.dashboardWidgetInstances[this.i % this.NUM].push({
                instanceId: t.instanceId,
                typeId: t.typeId,
                type: dashboardWidgetInfo.type
            } as DashboardWidgetInstance);
            this.i += 1;
        });
    }
    serialize(): string {
        const strategyId = this.id;
        const data =  JSON.stringify({
            strategyId,
            instances: [...this.dashboardWidgetInstances[0], ...this.dashboardWidgetInstances[1]],
            special: this.dashboardWidgetInstances
        } as SerializeFormat);
        return data;
    }
    deserialize(data: string) {
        this.dashboardWidgetInstances = [[], []];
        this.i = 0;
        const strategyId = this.id;
        const x: SerializeFormat = JSON.parse(data);
        if (x.strategyId === strategyId) { // deserializing from same strategy id
            stickInTypes(x.special);
            this.dashboardWidgetInstances = x.special;
        } else {
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

@Injectable()
export class DashboardService {

    serializedData: string = JSON.stringify({
       strategyId: '2x',
       instances: [
           {instanceId: '1', typeId: Sample1WidgetComponent.info().id },
           {instanceId: '2', typeId: Sample1WidgetComponent.info().id },
           {instanceId: '3', typeId: Sample2WidgetComponent.info().id },
           {instanceId: '4', typeId: Sample2WidgetComponent.info().id },
       ],
       special: [
           [
               {instanceId: '1', typeId: Sample1WidgetComponent.info().id },
               {instanceId: '2', typeId: Sample1WidgetComponent.info().id },
           ],
           [
               {instanceId: '3', typeId: Sample2WidgetComponent.info().id },
               {instanceId: '4', typeId: Sample2WidgetComponent.info().id },
           ]
       ]
    } as SerializeFormat);

    getAllDashboardStrategies(): DashboardStrategy[] {
        return [...DASHBOARD_STRATEGIES];
    }

    getAllDashboardWidgetInfos(): DashboardWidgetInfo[] {
        return [...DASHBOARD_WIDGET_INFOS];
    }

    getUserDashboardLayoutData(myself: User): string {
        return this.serializedData;
    }

    saveDashboardLayout(serializeData: string): Observable<boolean> {
        this.serializedData = serializeData;
        return of(true);
    }
}
