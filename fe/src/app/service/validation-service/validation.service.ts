import {Injectable} from '@angular/core';
import {Validation, ValidationResult} from '../../model/validation.model';
import config from '../../utils/config.util';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const URL_GET_ALL_VALIDATIONS = () => `${config().api_host_url}/view/:viewId/validations`;
const URL_GET_VALIDATION_DETAILS = () => `${config().api_host_url}/view/:viewId/validation/:validationId`;
const URL_POST_VALIDATION = () => `${config().api_host_url}/view/:viewId/validation`;

@Injectable()
export class ValidationService {
    constructor(private httpClient: HttpClient) {}

    getAllValidations(viewId: number): Observable<Validation[]> {
        return this.httpClient.get<Validation[]>(
            URL_GET_ALL_VALIDATIONS().replace(':viewId', String(viewId)));
    }

    getValidationDetails(viewId: number, validationId: number): Observable<ValidationResult> {
        return this.httpClient.get<ValidationResult>(
            URL_GET_VALIDATION_DETAILS()
                .replace(':viewId', String(viewId))
                .replace(':validationId', String(validationId)));
    }

    scheduleValidation(viewId: number, name: string, description: string): Observable<{ok: boolean, validationId: number}> {
       return this.httpClient.post<{ok: boolean, validationId: number}>(
           URL_POST_VALIDATION().replace(':viewId', String(viewId)), {
               name, description
           });
    }
}
