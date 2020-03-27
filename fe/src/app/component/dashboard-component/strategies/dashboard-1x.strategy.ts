import {DashboardStrategy, DashboardWidgetInfo, DashboardWidgetInstance} from '../../../model/dashboard.model';
import {
    SerializedDashboardFormat,
    SerializedDashboardWidgetInstanceFormat
} from '../../../model/dashboard-serialzable.model';
import {DASHBOARD_WIDGET_INFOS} from '../widgets';
import {stickInTypes, StickInTypesArgs} from './dashboard-strategy-util';

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
        if (r) {
            const _r: StickInTypesArgs = stickInTypes(r);
            this.addDashboardWidgetInstances(_r as SerializedDashboardWidgetInstanceFormat[]);
        }
    }
}
