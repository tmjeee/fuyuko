import {Injectable} from '@angular/core';
import {DashboardWidgetInstance} from '../../component/dashboard-component/dashboard.model';
import {HttpClient} from '@angular/common/http';
import {DataMap, SerializedDashboardWidgetInstanceDataFormat} from '@fuyuko-common/model/dashboard-serialzable.model';
import config from '../../utils/config.util';
import {Observable} from 'rxjs';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {map} from 'rxjs/operators';
import {User} from '@fuyuko-common/model/user.model';
import {assertDefinedReturn} from '../../utils/common.util';

const URL_GET_WIDGET_DATA = () => `${config().api_host_url}/user/:userId/dashboard-widget-instance/:dashboardWidgetInstanceId`;
const URL_POST_WIDGET_DATA = () => `${config().api_host_url}/user/:userId/dashboard-widget-instance-data`;

// NOTE: this is scoped to each WidgetContainerComponent and each instance should serve just one DashboardWidget only
@Injectable()
export class DashboardWidgetService {

    // these are set in Dashboard Widget Container itself (widget-container.component.ts)
    widgetInstance!: DashboardWidgetInstance;
    currentUser!: User;

    constructor(private httpClient: HttpClient) {}

    saveData(data: DataMap): Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(URL_POST_WIDGET_DATA().replace(':userId', String(this.currentUser.id)), {
            instanceId: this.widgetInstance.instanceId,
            typeId: this.widgetInstance.typeId,
            data
        } as SerializedDashboardWidgetInstanceDataFormat);

    }

    loadData(): Observable<DataMap> {
        return this.httpClient
            .get<ApiResponse<DataMap>>(URL_GET_WIDGET_DATA().replace(':userId', String(this.currentUser.id)))
            .pipe(
                map((r: ApiResponse<DataMap>) => assertDefinedReturn(r.payload))
            );
    }
}
