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
import {SerializedDashboardFormat, SerializedDashboardWidgetInstanceFormat} from '../../model/dashboard-serialzable.model';
import {HttpClient} from '@angular/common/http';
import config from '../../utils/config.util';
import {map} from 'rxjs/operators';


// a must be array / multi-dimention array of SerializeInstanceFormat
const stickInTypes = (a: SerializedDashboardWidgetInstanceFormat|
                         SerializedDashboardWidgetInstanceFormat[] |
                         SerializedDashboardWidgetInstanceFormat[][]) => {
    if (Array.isArray(a)) {
        const ar: SerializedDashboardWidgetInstanceFormat[] = a as SerializedDashboardWidgetInstanceFormat[];
        for (const ai of ar) {
            stickInTypes(ai);
        }
    } else  {
       const d: SerializedDashboardWidgetInstanceFormat =  a as SerializedDashboardWidgetInstanceFormat;
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
    addDashboardWidgetInstances(serializeInstanceFormats: SerializedDashboardWidgetInstanceFormat[]) {
        serializeInstanceFormats.forEach((t: SerializedDashboardWidgetInstanceFormat) => {
            const dashboardWidgetInfo: DashboardWidgetInfo = DASHBOARD_WIDGET_INFOS.find((dwi: DashboardWidgetInfo) => dwi.id === t.typeId);
            this.dashboardWidgetInstances.push({
                instanceId: t.instanceId,
                typeId: t.typeId,
                type: dashboardWidgetInfo.type
            } as DashboardWidgetInstance);
        });
    }
    removeDashboardWidgetInstances(instanceIds: string[]) {
        this.dashboardWidgetInstances = this.dashboardWidgetInstances
            .filter((i: DashboardWidgetInstance) => !instanceIds.includes(i.instanceId));
    }
    moveDashboardWidgetInstances(columnIndex: number, previousIndex: number, currentIndex: number) {
        [this.dashboardWidgetInstances[currentIndex], this.dashboardWidgetInstances[previousIndex]] =
            [this.dashboardWidgetInstances[currentIndex], this.dashboardWidgetInstances[previousIndex]];
    }
    transferDashboardWidgetInstances(previousColumnIndex: number, currentColumnIndex: number,
                                     previousIndex: number, currentIndex: number) {
        this.moveDashboardWidgetInstances(currentColumnIndex, previousIndex, currentIndex);
    }
    serialize(): string {
        const strategyId = this.id;
        const data: string =  JSON.stringify({
            strategyId: this.id,
            instances: this.dashboardWidgetInstances,
            special: undefined
        } as SerializedDashboardFormat);
        return data;
    }
    deserialize(data: string) {
        this.dashboardWidgetInstances = [];
        const x: SerializedDashboardFormat = JSON.parse(data);
        const r: SerializedDashboardWidgetInstanceFormat[] = x.instances;
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
    addDashboardWidgetInstances(serializeInstanceFormats: SerializedDashboardWidgetInstanceFormat[]) {
        serializeInstanceFormats.forEach((t: SerializedDashboardWidgetInstanceFormat) => {
            const dashboardWidgetInfo: DashboardWidgetInfo = DASHBOARD_WIDGET_INFOS.find((dwi: DashboardWidgetInfo) => dwi.id === t.typeId);
            this.dashboardWidgetInstances[this.i % this.NUM].push({
                instanceId: t.instanceId,
                typeId: t.typeId,
                type: dashboardWidgetInfo.type
            } as DashboardWidgetInstance);
            this.i += 1;
        });
    }
    removeDashboardWidgetInstances(instanceIds: string[]) {
        this.dashboardWidgetInstances = [
            this.dashboardWidgetInstances[0] =
                this.dashboardWidgetInstances[0].filter((i: DashboardWidgetInstance) => !instanceIds.includes(i.instanceId)),
            this.dashboardWidgetInstances[1] =
                this.dashboardWidgetInstances[1].filter((i: DashboardWidgetInstance) => !instanceIds.includes(i.instanceId))
        ];
    }
    moveDashboardWidgetInstances(columnIndex: number, previousIndex: number, currentIndex: number) {
        [this.dashboardWidgetInstances[columnIndex][currentIndex], this.dashboardWidgetInstances[columnIndex][previousIndex]] =
            [this.dashboardWidgetInstances[columnIndex][currentIndex], this.dashboardWidgetInstances[columnIndex][previousIndex]];
    }
    transferDashboardWidgetInstances(previousColumnIndex: number, currentColumnIndex: number,
                                     previousIndex: number, currentIndex: number) {
        const tmp: DashboardWidgetInstance = this.dashboardWidgetInstances[previousColumnIndex][previousIndex];
        this.dashboardWidgetInstances[previousColumnIndex].splice(previousIndex, 1);
        this.dashboardWidgetInstances[currentColumnIndex].splice(currentIndex, 0, tmp);
    }
    serialize(): string {
        const strategyId = this.id;
        const data =  JSON.stringify({
            strategyId,
            instances: [...this.dashboardWidgetInstances[0], ...this.dashboardWidgetInstances[1]],
            special: this.dashboardWidgetInstances
        } as SerializedDashboardFormat);
        return data;
    }
    deserialize(data: string) {
        this.dashboardWidgetInstances = [[], []];
        this.i = 0;
        const strategyId = this.id;
        const x: SerializedDashboardFormat = JSON.parse(data);
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


const URL_GET_DASHBOARD_FORMAT = () => `${config().api_host_url}/user/:userId/dashboard`;
const URL_SAVE_DASHBOARD_FORMAT = () => `${config().api_host_url}/user/:userId/dashboard/save`;

@Injectable()
export class DashboardService {

    /*
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
     */

    constructor(private httpClient: HttpClient) {}

    getAllDashboardStrategies(): DashboardStrategy[] {
        return [...DASHBOARD_STRATEGIES];
    }

    getAllDashboardWidgetInfos(): DashboardWidgetInfo[] {
        return [...DASHBOARD_WIDGET_INFOS];
    }

    getUserDashboardLayoutData(myself: User): Observable<string> {
        return this.httpClient
            .get<{data: string}>(URL_GET_DASHBOARD_FORMAT().replace(':userId', String(myself.id)))
            .pipe(
                map((r: {data: string}) => {
                    const d = (r.data ? r.data.trim() : r.data);
                    if (d) {
                        try {
                            return JSON.parse(d);
                        } catch (e) {
                        }
                    }
                    return '{}';
                })
            );
    }

    saveDashboardLayout(myself: User, serializeData: string): Observable<boolean> {
        return this.httpClient.post<boolean>(URL_SAVE_DASHBOARD_FORMAT().replace(':userId', String(myself.id)), {
            serializeFormat: serializeData
        });
    }
}
