import {Injectable} from '@angular/core';
import {DashboardWidgetInstance} from '../../model/dashboard.model';
import {HttpClient} from '@angular/common/http';
import {DataMap, SerializedDashboardWidgetInstanceDataFormat} from '../../model/dashboard-serialzable.model';
import config from '../../utils/config.util';
import {Observable} from 'rxjs';

const URL_GET_WIDGET_DATA = () => `${config().api_host_url}/user/:userId/dashboard-widget-instance/:dashboardWidgetInstanceId`;
const URL_POST_WIDGET_DATA = () => `${config().api_host_url}/user/:userId/dashboard-widget-instance-data`;

@Injectable()
export class DashboardWidgetService {

    constructor(private httpClient: HttpClient) {}

    saveData(userId: number, widgetInstance: DashboardWidgetInstance, data: DataMap): Observable<boolean> {
        return this.httpClient.post<boolean>(URL_POST_WIDGET_DATA().replace(':userId', String(userId)), {
            instanceId: widgetInstance.instanceId,
            typeId: widgetInstance.typeId,
            data
        } as SerializedDashboardWidgetInstanceDataFormat);

    }

    loadData(userId: number, widgetInstance: DashboardWidgetInstance): Observable<DataMap> {
        return this.httpClient.get<DataMap>(URL_GET_WIDGET_DATA().replace(':userId', String(userId)));
    }
}
