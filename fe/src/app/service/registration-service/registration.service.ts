import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RegistrationResponse} from '../../model/registration.model';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import config from '../../utils/config.util';

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
