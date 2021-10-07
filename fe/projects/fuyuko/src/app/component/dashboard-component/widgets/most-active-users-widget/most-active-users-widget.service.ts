import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import config from '../../../../utils/config.util';
import {map, take} from 'rxjs/operators';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {Reporting_MostActiveUsers} from '@fuyuko-common/model/reporting.model';
import {Observable} from 'rxjs';

const URL_GET_MOST_ACTIVE_USERS = () => `${config().api_host_url}/reporting/most-active-users`;

@Injectable()
export class MostActiveUsersWidgetService {

    constructor(private httpClient: HttpClient) {
    }

    getActiveUsersInfo(): Observable<Reporting_MostActiveUsers> {
        return this.httpClient.get<ApiResponse<Reporting_MostActiveUsers>>(URL_GET_MOST_ACTIVE_USERS())
            .pipe(
                take(1),
                map((r: ApiResponse<Reporting_MostActiveUsers>) => r.payload!)
            );
    }

}
