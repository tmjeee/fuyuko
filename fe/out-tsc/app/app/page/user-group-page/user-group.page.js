import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { UserManagementService } from '../../service/user-management-service/user-management.service';
import { map, tap } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';
import { toNotifications } from '../../service/common.service';
let UserGroupPageComponent = class UserGroupPageComponent {
    constructor(userManagementService, notificationsService) {
        this.userManagementService = userManagementService;
        this.notificationsService = notificationsService;
        this.allGroupsUsers = new Map(); // {[groupId: string]: User[]} = {};
        this.actions = [
            { icon: '', tooltip: 'Remove user from group', type: 'DELETE' }
        ];
    }
    ngOnInit() {
        this.userManagementService
            .getAllGroups()
            .pipe(map((g) => {
            this.allGroups = g;
            g.reduce((a, grp) => {
                a.set(grp, []);
                return a;
            }, this.allGroupsUsers);
            this.reloadGroupUsers();
        })).subscribe();
        this.userSearchFn = (group) => {
            return (user) => {
                return this.userManagementService.findUsersNotInGroup(group);
            };
        };
    }
    reloadGroupUsers() {
        Array.from(this.allGroupsUsers.keys())
            .forEach((grp) => {
            this._reloadGroupUser(grp);
        });
    }
    _reloadGroupUser(grp) {
        this.userManagementService.findUsersInGroup(grp)
            .pipe(map((users) => {
            this.allGroupsUsers.set(grp, users);
        })).subscribe();
    }
    onUserTableEvent(e, g) {
        switch (e.type) {
            case this.actions[0].type: // 'DELETE' action type
                this.userManagementService.removeUserFromGroup(e.user, g).pipe(tap((r) => {
                    toNotifications(this.notificationsService, r);
                    this._reloadGroupUser(g);
                })).subscribe();
                break;
            case 'SELECTION':
                this.userManagementService.addUserToGroup(e.user, g).pipe(tap((r) => {
                    toNotifications(this.notificationsService, r);
                    this._reloadGroupUser(g);
                })).subscribe();
                break;
        }
    }
};
UserGroupPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './user-group.page.html',
        styleUrls: ['./user-group.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [UserManagementService, NotificationsService])
], UserGroupPageComponent);
export { UserGroupPageComponent };
//# sourceMappingURL=user-group.page.js.map