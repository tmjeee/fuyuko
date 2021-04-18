import {Injectable} from '@angular/core';
import config from '../../../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {map, take} from 'rxjs/operators';
import {Reporting_ViewAttributeValidationSummary} from '@fuyuko-common/model/reporting.model';
import {Observable} from 'rxjs';

const URL_GET_VIEW_ATTRIBUTE_VALIDATION_SUMMARY =
    () => `${config().api_host_url}/reporting/view-attributes-validation-summary/view/:viewId`;

@Injectable()
export class ViewAttributeValidationSummaryWidgetService {

    constructor(private httpClient: HttpClient) {}

    getViewValidationSummary(viewId: number): Observable<Reporting_ViewAttributeValidationSummary> {
        return this.httpClient
            .get<ApiResponse<Reporting_ViewAttributeValidationSummary>>(URL_GET_VIEW_ATTRIBUTE_VALIDATION_SUMMARY()
                .replace(':viewId', String(viewId)))
            .pipe(
                take(1),
                map((r: ApiResponse<Reporting_ViewAttributeValidationSummary>) => r.payload)
            );
    }

}
