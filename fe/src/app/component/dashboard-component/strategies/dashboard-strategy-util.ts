// a must be array / multi-dimention array of SerializeInstanceFormat
import {SerializedDashboardWidgetInstanceFormat} from '../../../model/dashboard-serialzable.model';
import {DashboardWidgetInfo} from '../../../model/dashboard.model';
import {DASHBOARD_WIDGET_INFOS} from '../widgets';

export const stickInTypes = (a: SerializedDashboardWidgetInstanceFormat|
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
