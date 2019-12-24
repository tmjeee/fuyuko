import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { UserManagementService } from '../../service/user-management-service/user-management.service';
import { NotificationsService } from 'angular2-notifications';
import { map, tap } from 'rxjs/operators';
import { toNotifications } from '../../service/common.service';
let UserPeoplePageComponent = class UserPeoplePageComponent {
    constructor(userManagementService, notificationService) {
        this.userManagementService = userManagementService;
        this.notificationService = notificationService;
        this.inactiveUserSearchFn = (userName) => {
            return this.userManagementService.findPendingUsers(userName);
        };
        this.activeUserSearchFn = (userName) => {
            return this.userManagementService.findActiveUsers(userName);
        };
        this.activeUsersActionTypes = [{ type: 'DEACTIVATE', icon: 'remove_circle', tooltip: 'Deactivate User' }];
        this.inactiveUsersActionTypes = [{ type: 'ACTIVATE', icon: 'add_box', tooltip: 'Activate User' }];
    }
    ngOnInit() {
        this.reload();
    }
    reload() {
        this.userManagementService.getAllActiveUsers().pipe(tap((u) => {
            this.activeUsers = u;
        })).subscribe();
        this.userManagementService.getAllInactiveUsers().pipe(map((u) => this.inactiveUsers = u)).subscribe();
    }
    onActiveUsersTableEvent($event) {
        switch ($event.type) {
            case 'DEACTIVATE':
                this.userManagementService.setUserStatus($event.user.id, 'DISABLED')
                    .pipe(tap((r) => {
                    toNotifications(this.notificationService, r);
                    this.reload();
                })).subscribe();
                break;
        }
    }
    onInactiveUsersTableEvent($event) {
        switch ($event.type) {
            case 'ACTIVATE':
                this.userManagementService.setUserStatus($event.user.id, 'ENABLED')
                    .pipe(tap((r) => {
                    toNotifications(this.notificationService, r);
                    this.reload();
                })).subscribe();
                break;
        }
    }
};
UserPeoplePageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './user-people.page.html',
        styleUrls: ['./user-people.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [UserManagementService,
        NotificationsService])
], UserPeoplePageComponent);
export { UserPeoplePageComponent };
//# sourceMappingURL=user-people.page.js.map