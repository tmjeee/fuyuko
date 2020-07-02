// a must be array / multi-dimention array of SerializeInstanceFormat
import {SerializedDashboardWidgetInstanceFormat} from '../../../model/dashboard-serialzable.model';
import {DashboardWidgetInfo} from '../dashboard.model';
import {DASHBOARD_WIDGET_INFOS} from '../widgets';

export type StickInTypesArgs = SerializedDashboardWidgetInstanceFormat | 
                               SerializedDashboardWidgetInstanceFormat[] | 
                               SerializedDashboardWidgetInstanceFormat[][];

export const stickInTypes = (a: StickInTypesArgs): StickInTypesArgs => {
    if (Array.isArray(a)) {
        const arr: any = [];
        const ar: SerializedDashboardWidgetInstanceFormat[] = a as SerializedDashboardWidgetInstanceFormat[];
        for (const ai of ar) {
            var r: SerializedDashboardWidgetInstanceFormat[] = stickInTypes(ai) as SerializedDashboardWidgetInstanceFormat[]; 
            if (r) {
                arr.push(r);
            }
        }
        return arr;
    } else  {
        const d: SerializedDashboardWidgetInstanceFormat =  a as SerializedDashboardWidgetInstanceFormat;
        const wi: DashboardWidgetInfo = DASHBOARD_WIDGET_INFOS.find((i: DashboardWidgetInfo) => i.id === d.typeId);
        if (wi) {
            (d as any).type = wi.type;
            return d;
        } else {
            console.error(
                `DashboardWidgetInstance instanceId ${d.instanceId} of typeId ${d.typeId} is an invalid entry, cannot identify the type`);
            return null;
        }
    }
};
