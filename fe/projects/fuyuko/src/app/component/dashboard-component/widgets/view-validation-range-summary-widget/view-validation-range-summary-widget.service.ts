import {Injectable} from "@angular/core";
import config from "../../../../utils/config.util";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../../../model/api-response.model";
import {Reporting_ViewValidationRangeSummary} from "../../../../model/reporting.model";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

const URL_GET_VIEW_VALIDATION_SUMMARY = () => `${config().api_host_url}/reporting/view-validation-range-summary/view/:viewId`;

@Injectable()
export class ViewValidationRangeSummaryWidgetService {
    
    constructor(protected httpClient: HttpClient) {}

    getViewValidationRangeSummary(viewId: number): Observable<Reporting_ViewValidationRangeSummary> {
        return this.httpClient
            .get<ApiResponse<Reporting_ViewValidationRangeSummary>>(URL_GET_VIEW_VALIDATION_SUMMARY().replace(':viewId', String(viewId)))
            .pipe(map((r: ApiResponse<Reporting_ViewValidationRangeSummary>) => r.payload));
    }
}