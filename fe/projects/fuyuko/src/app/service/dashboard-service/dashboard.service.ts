import {Injectable } from '@angular/core';
import {
    DashboardStrategy,
    DashboardWidgetInfo,
} from '../../component/dashboard-component/dashboard.model';
import {User} from '@fuyuko-common/model/user.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import config from '../../utils/config.util';
import {map} from 'rxjs/operators';
import {DASHBOARD_STRATEGIES} from '../../component/dashboard-component/strategies';
import {DASHBOARD_WIDGET_INFOS} from '../../component/dashboard-component/widgets';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

const URL_GET_DASHBOARD_FORMAT = () => `${config().api_host_url}/user/:userId/dashboard`;
const URL_SAVE_DASHBOARD_FORMAT = () => `${config().api_host_url}/user/:userId/dashboard/save`;

@Injectable()
export class DashboardService {

    /* JSON Format of SerializeFormat
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
            .get<ApiResponse<{data: string}>>(URL_GET_DASHBOARD_FORMAT().replace(':userId', String(myself.id)))
            .pipe(
                map((r: ApiResponse<{data: string}>) => r.payload),
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

    saveDashboardLayout(myself: User, serializeData: string): Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(URL_SAVE_DASHBOARD_FORMAT().replace(':userId', String(myself.id)), {
            serializeFormat: serializeData
        });
    }
}
