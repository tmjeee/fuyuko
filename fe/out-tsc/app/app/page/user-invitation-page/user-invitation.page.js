import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { UserManagementService } from '../../service/user-management-service/user-management.service';
import { InvitationService } from '../../service/invitation-service/invitation.service';
import { tap } from 'rxjs/operators';
import { toNotifications } from '../../service/common.service';
let UserInvitationPageComponent = class UserInvitationPageComponent {
    constructor(notificationService, userManagementService, invitationService) {
        this.notificationService = notificationService;
        this.userManagementService = userManagementService;
        this.invitationService = invitationService;
        this.groupSearchFn = (groupName) => {
            return this.userManagementService.findInGroup(groupName);
        };
    }
    onSendInvite($event) {
        this.invitationService
            .createInvitation($event.email, $event.groups)
            .pipe(tap((r) => {
            toNotifications(this.notificationService, r);
        })).subscribe();
    }
};
UserInvitationPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './user-invitation.page.html',
        styleUrls: ['./user-invitation.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [NotificationsService,
        UserManagementService,
        InvitationService])
], UserInvitationPageComponent);
export { UserInvitationPageComponent };
//# sourceMappingURL=user-invitation.page.js.map