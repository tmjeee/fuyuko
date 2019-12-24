import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { UserManagementService } from '../../service/user-management-service/user-management.service';
import { map, tap } from 'rxjs/operators';
import { toNotifications } from '../../service/common.service';
let UserActivationPageComponent = class UserActivationPageComponent {
    constructor(notificationService, userManagementService) {
        this.notificationService = notificationService;
        this.userManagementService = userManagementService;
        this.pendingUserSearchFn = (userName) => {
            return this.userManagementService.findPendingUsers(userName);
        };
        this.actionTypes = [
            { type: 'ACTIVATE', icon: 'add_circle', tooltip: 'Activate Self Registered User' },
            { type: 'DELETE', icon: 'delete', tooltip: 'Delete this Self Registered User entry' }
        ];
    }
    ngOnInit() {
        this.reload();
    }
    reload() {
        this.userManagementService.getAllPendingUsers().pipe(map((u) => {
            this.pendingUsers = u;
        })).subscribe();
    }
    onPendingUsersTableEvent($event) {
        switch ($event.type) {
            case 'DELETE': {
                this.userManagementService.deletePendingUser($event.user)
                    .pipe(tap((r) => {
                    toNotifications(this.notificationService, r);
                })).subscribe();
                break;
            }
            case 'ACTIVATE': {
                this.userManagementService.approvePendingUser($event.user)
                    .pipe(tap((r) => {
                    toNotifications(this.notificationService, r);
                })).subscribe();
                break;
            }
        }
    }
};
UserActivationPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './user-activation.page.html',
        styleUrls: ['./user-activation.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [NotificationsService,
        UserManagementService])
], UserActivationPageComponent);
export { UserActivationPageComponent };
//# sourceMappingURL=user-activation.page.js.map