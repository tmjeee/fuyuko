import {Injectable} from '@angular/core';
import config from '../../../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {Reporting_ViewAttributeValidationRangeSummary} from '@fuyuko-common/model/reporting.model';

const URL_GET_VIEW_ATTRIBUTE_VALIDATION_SUMMARY = () => `${config().api_host_url}/reporting/view-attributes-validation-range-summary/view/:viewId`;

@Injectable()
export class ViewAttributeValidationRangeSummaryWidgetService {

    constructor(private httpClient: HttpClient) {}

    getViewAttributesValidationRangeSummary(viewId: number) {
        return this.httpClient
            .get<ApiResponse<Reporting_ViewAttributeValidationRangeSummary>>(
                URL_GET_VIEW_ATTRIBUTE_VALIDATION_SUMMARY().replace(':viewId', String(viewId)))
            .pipe(map((r: ApiResponse<Reporting_ViewAttributeValidationRangeSummary>) => r.payload));
    }
}
