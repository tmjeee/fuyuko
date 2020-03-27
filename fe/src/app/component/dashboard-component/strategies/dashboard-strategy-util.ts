// a must be array / multi-dimention array of SerializeInstanceFormat
import {SerializedDashboardWidgetInstanceFormat} from '../../../model/dashboard-serialzable.model';
import {DashboardWidgetInfo} from '../../../model/dashboard.model';
import {DASHBOARD_WIDGET_INFOS} from '../widgets';

export type StickInTypesArgs = SerializedDashboardWidgetInstanceFormat| SerializedDashboardWidgetInstanceFormat[] | SerializedDashboardWidgetInstanceFormat[][];

export interface StickInTypes {
    (a: StickInTypesArgs):StickInTypesArgs;
}

export const stickInTypes: StickInTypes = (a: StickInTypesArgs) => {
    if (Array.isArray(a)) {
        const arr = [];
        const ar: SerializedDashboardWidgetInstanceFormat[] = a as SerializedDashboardWidgetInstanceFormat[];
        for (const ai of ar) {
            var r: StickInTypesArgs = stickInTypes(ai);
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
