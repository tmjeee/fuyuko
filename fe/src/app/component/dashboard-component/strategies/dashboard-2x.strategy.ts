import {DashboardStrategy, DashboardWidgetInfo, DashboardWidgetInstance} from '../../../model/dashboard.model';
import {
    SerializedDashboardFormat,
    SerializedDashboardWidgetInstanceFormat
} from '../../../model/dashboard-serialzable.model';
import {DASHBOARD_WIDGET_INFOS} from '../widgets';
import {stickInTypes, StickInTypesArgs} from './dashboard-strategy-util';

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
            const _x_special: StickInTypesArgs = stickInTypes(x.special);
            this.dashboardWidgetInstances = _x_special as DashboardWidgetInstance[][];
        } else if (x.instances) {
            const _x_instances: StickInTypesArgs = stickInTypes(x.instances);
            this.addDashboardWidgetInstances(_x_instances as DashboardWidgetInstance[]);
        }
    }
}
