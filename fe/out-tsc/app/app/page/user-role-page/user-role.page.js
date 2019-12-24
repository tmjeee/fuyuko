import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { SEARCH_ACTION_TYPE } from '../../component/group-table-component/group-table.component';
import { UserManagementService } from '../../service/user-management-service/user-management.service';
import { map, tap } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';
import { toNotifications } from '../../service/common.service';
let UserRolePageComponent = class UserRolePageComponent {
    constructor(userManagementService, notificationsService) {
        this.userManagementService = userManagementService;
        this.notificationsService = notificationsService;
        this.allRoles = [];
        this.allRoleGroups = new Map();
        this.actions = [
            { type: 'DELETE', icon: 'remove_circle', tooltip: 'REmove role to this group' }
        ];
    }
    ngOnInit() {
        this.userManagementService.allRoles()
            .pipe(tap((r) => {
            console.log('**************** roles', r);
            this.allRoles = r;
            this.allRoleGroups = r.reduce((a, role) => {
                a.set(role, []);
                return a;
            }, new Map());
            this.reloadRoleGroups();
        })).subscribe();
        this.groupSearchByRole = (role) => {
            return (group) => {
                return this.userManagementService
                    .findGroupWithoutRole(role.name)
                    .pipe(map((p) => p.payload));
            };
        };
    }
    reloadRoleGroups() {
        Array.from(this.allRoleGroups.keys())
            .forEach((role) => {
            this._reloadRoleGroups(role);
        });
    }
    _reloadRoleGroups(role) {
        this.userManagementService
            .findGroupWithRole(role.name)
            .pipe(map((p) => p.payload), map((groups) => {
            this.allRoleGroups.set(role, groups);
        })).subscribe();
    }
    onRoleGroupTableEvent($event, role) {
        console.log('**************** role group table $event', $event);
        console.log('role', role);
        console.log('group', $event.group);
        switch ($event.type) {
            case this.actions[0].type: // 'DELETE' type
                this.userManagementService.removeRoleFromGroup(role, $event.group)
                    .pipe(tap((r) => {
                    toNotifications(this.notificationsService, r);
                    this._reloadRoleGroups(role);
                })).subscribe();
                break;
            case SEARCH_ACTION_TYPE: // when user search and 'select' this group from drop down
                // add role to group
                this.userManagementService.addRoleToGroup(role, $event.group)
                    .pipe(tap((r) => {
                    toNotifications(this.notificationsService, r);
                    this._reloadRoleGroups(role);
                })).subscribe();
                break;
        }
    }
};
UserRolePageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './user-role.page.html',
        styleUrls: ['./user-role.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [UserManagementService,
        NotificationsService])
], UserRolePageComponent);
export { UserRolePageComponent };
//# sourceMappingURL=user-role.page.js.map