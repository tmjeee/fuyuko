import {Injectable} from '@angular/core';
import {DashboardWidgetInstance, DataMap} from '../../model/dashboard.model';


const MAP = {};

@Injectable()
export class DashboardWidgetService {

    saveData(widgetInstance: DashboardWidgetInstance, data: DataMap) {
        MAP[widgetInstance.instanceId] = data;
    }

    loadData(widgetInstance: DashboardWidgetInstance): DataMap {
        const r = MAP[widgetInstance.instanceId];
        return r;
    }
}
