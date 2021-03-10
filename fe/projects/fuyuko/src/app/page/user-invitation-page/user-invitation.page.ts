import {Component} from '@angular/core';
import {GroupSearchFn, SendInviteComponentEvent} from '../../component/send-invite-component/send-invite.component';
import {NotificationsService} from 'angular2-notifications';
import {Observable} from 'rxjs';
import {Group} from '@fuyuko-common/model/group.model';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {InvitationService} from '../../service/invitation-service/invitation.service';
import {tap} from 'rxjs/operators';
import {toNotifications} from '../../service/common.service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


@Component({
    templateUrl: './user-invitation.page.html',
    styleUrls: ['./user-invitation.page.scss']
})
export class UserInvitationPageComponent {

    constructor(private notificationService: NotificationsService,
                private userManagementService: UserManagementService,
                private invitationService: InvitationService) {
        this.groupSearchFn = (groupName: string): Observable<Group[]> => {
            return this.userManagementService.findInGroup(groupName);
        };
    }

    groupSearchFn: GroupSearchFn;


    onSendInvite($event: SendInviteComponentEvent) {
        this.invitationService
            .createInvitation($event.email, $event.groups)
            .pipe(
                tap((r: ApiResponse) => {
                    toNotifications(this.notificationService, r);
                })
            ).subscribe();
    }
}
