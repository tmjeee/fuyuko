import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import config from '../../utils/config.util';
import {RegistrationResponse} from '@fuyuko-common/model/api-response.model';

const URL_REGISTER = () => `${config().api_host_url}/self-register`;

@Injectable()
export class RegistrationService {

    constructor(private httpClient: HttpClient) {}

    register(email: string, username: string, firstName: string, lastName: string, password: string): Observable<RegistrationResponse> {
        return this.httpClient.post<RegistrationResponse>(URL_REGISTER(), {
            email, username, password, firstName, lastName
        });
    }

}
