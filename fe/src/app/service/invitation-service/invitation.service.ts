import {Injectable} from '@angular/core';
import {Group} from '../../model/group.model';
import {Observable} from 'rxjs';
import {CreateInvitationResponse} from '../../model/invitation.model';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import config from '../../utils/config.util';

const URL_CREATE_INVITATION = () => `${config().api_host_url}/create-invitation`;

@Injectable()
export class InvitationService {

    constructor(private httpClient: HttpClient) {
    }

    createInvitation(email: string, groups: Group[]): Observable<CreateInvitationResponse> {
        return this.httpClient.post<CreateInvitationResponse>(URL_CREATE_INVITATION(), {
            email,
            groupIds: (groups ? groups.map((g: Group) => g.id) : [])
        });
    }
}
