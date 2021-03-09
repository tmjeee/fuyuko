import {Injectable} from '@angular/core';
import config from '../../../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {map, take} from 'rxjs/operators';
import {Reporting_ViewValidationSummary} from '@fuyuko-common/model/reporting.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {Observable} from 'rxjs';

const URL_GET_VIEW_VALIDATION_SUMMARY = () => `${config().api_host_url}/reporting/view-validation-summary/view/:viewId`;

@Injectable()
export class ViewValidationSummaryWidgetService {

    constructor(private httpClient: HttpClient) {
    }

    getViewValidationSummary(viewId: number): Observable<Reporting_ViewValidationSummary> {
        return this.httpClient
            .get<ApiResponse<Reporting_ViewValidationSummary>>(URL_GET_VIEW_VALIDATION_SUMMARY().replace(':viewId', String(viewId)))
            .pipe(
                take(1),
                map((r: ApiResponse<Reporting_ViewValidationSummary>) => r.payload)
            );
    }


}
