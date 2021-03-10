import {Injectable} from '@angular/core';
import {Group} from '@fuyuko-common/model/group.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import config from '../../utils/config.util';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

const URL_CREATE_INVITATION = () => `${config().api_host_url}/create-invitation`;

@Injectable()
export class InvitationService {

    constructor(private httpClient: HttpClient) {
    }

    createInvitation(email: string, groups: Group[]): Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(URL_CREATE_INVITATION(), {
            email,
            groupIds: (groups ? groups.map((g: Group) => g.id) : [])
        });
    }
}
