import {Injectable} from '@angular/core';
import {Validation, ValidationLogResult, ValidationResult} from '../../model/validation.model';
import config from '../../utils/config.util';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiResponse, ScheduleValidationResponse} from "../../model/api-response.model";
import {map} from "rxjs/operators";

const URL_GET_ALL_VALIDATIONS = () => `${config().api_host_url}/view/:viewId/validations`;
const URL_GET_VALIDATION_DETAILS = () => `${config().api_host_url}/view/:viewId/validation/:validationId`;
const URL_GET_VALIDATION_LOG_RESULT = () => `${config().api_host_url}/view/:viewId/validation/:validationId/validationLogId/:validationLogId/order/:order/limit/:limit`;
const URL_POST_SCHEDULE_VALIDATION = () => `${config().api_host_url}/view/:viewId/validation`;
const URL_DELETE_VALIDATION = () => `${config().api_host_url}/view/:viewId/validation/:validationId`;

@Injectable()
export class ValidationService {
    constructor(private httpClient: HttpClient) {}

    getAllValidations(viewId: number): Observable<Validation[]> {
        return this.httpClient
            .get<ApiResponse<Validation[]>>(URL_GET_ALL_VALIDATIONS().replace(':viewId', String(viewId)))
            .pipe(
                map((r: ApiResponse<Validation[]>) => r.payload)
            );
    }

    getValidationLogResult(viewId: number, validationId: number, validationLogId?: number, order: 'before' | 'after' = 'after', limit: number = 100): Observable<ValidationLogResult> {
        return this.httpClient
            .get<ApiResponse<ValidationLogResult>>(URL_GET_VALIDATION_LOG_RESULT()
                .replace(':viewId', String(viewId))
                .replace(':validationId', String(validationId))
                .replace(':validationLogId', validationLogId ? String(validationLogId) : '')
                .replace(':order', order)
                .replace(':limit', String(limit))
            ).pipe(
                map((r: ApiResponse<ValidationLogResult>) => r.payload)
            );
    }

    getValidationDetails(viewId: number, validationId: number): Observable<ValidationResult> {
        return this.httpClient.get<ApiResponse<ValidationResult>>(
            URL_GET_VALIDATION_DETAILS()
                .replace(':viewId', String(viewId))
                .replace(':validationId', String(validationId)))
            .pipe(
                map((r: ApiResponse<ValidationResult>) => r.payload)
            );
    }

    scheduleValidation(viewId: number, name: string, description: string): Observable<ScheduleValidationResponse> {
       return this.httpClient.post<ScheduleValidationResponse>(
           URL_POST_SCHEDULE_VALIDATION().replace(':viewId', String(viewId)), {
               name, description
           });
    }

    deleteValidation(viewId: number, validationId: number): Observable<ApiResponse> {
       return this.httpClient
           .delete<ApiResponse>(
               URL_DELETE_VALIDATION()
                   .replace(':validationId', String(validationId))
                   .replace(':viewId', String(viewId)));
    }
}
