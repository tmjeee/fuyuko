import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Activation, Invitation } from '../../model/activation.model';
import {HttpClient} from '@angular/common/http';
import config from '../../../assets/config.json';
import {tap} from "rxjs/operators";

const URL_GET_INVITATION_BY_CODE = `${config.api_host_url}/invitations`;
const URL_ACTIVATE_BY_CODE = `${config.api_host_url}/activate-invitation`;


@Injectable()
export class ActivationService {

    constructor(private httpClient: HttpClient) {}

    getInvitation(code: string): Observable<Invitation> {
        return this.httpClient
            .get<Invitation>(`${URL_GET_INVITATION_BY_CODE}/${code}`);
    }

    activate(code: string, email: string, username: string, firstName: string, lastName: string, password: string): Observable<Activation> {
        return this.httpClient
            .post<Activation>(`${URL_ACTIVATE_BY_CODE}/${code}`, {
                username,
                email,
                firstName,
                lastName,
                password
            });
    }
}
