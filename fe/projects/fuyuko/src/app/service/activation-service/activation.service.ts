import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Activation, Invitation } from '@fuyuko-common/model/activation.model';
import {HttpClient} from '@angular/common/http';
import config from '../../utils/config.util';
import {map} from 'rxjs/operators';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

const URL_GET_INVITATION_BY_CODE = () => `${config().api_host_url}/invitations/:code`;
const URL_ACTIVATE_BY_CODE = () => `${config().api_host_url}/activate-invitation/:code`;


@Injectable()
export class ActivationService {

    constructor(private httpClient: HttpClient) {}

    getInvitation(code: string): Observable<Invitation> {
        return this.httpClient
            .get<ApiResponse<Invitation>>(URL_GET_INVITATION_BY_CODE().replace(':code', code))
            .pipe(
                map((r: ApiResponse<Invitation>) => r.payload)
            );
    }

    activate(code: string, email: string, username: string, firstName: string, lastName: string, password: string): Observable<Activation> {
        return this.httpClient
            .post<ApiResponse<Activation>>(URL_ACTIVATE_BY_CODE().replace(':code', code), {
                username,
                email,
                firstName,
                lastName,
                password
            })
            .pipe(
                map((r: ApiResponse<Activation>) => r.payload)
            );
    }
}
