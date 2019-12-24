import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import config from '../../utils/config.util';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
const URL_ALL_ROLES = `${config.api_host_url}/roles`;
const URL_ALL_GROUPS_WITHOUT_ROLE = `${config.api_host_url}/groups/no-role/:roleName`;
const URL_ALL_GROUPS_WITH_ROLE = `${config.api_host_url}/groups/with-role/:roleName`;
const URL_ADD_ROLE_TO_GROUP = `${config.api_host_url}/group/:groupId/role/:roleName`;
const URL_DELETE_ROLE_FROM_GROUP = `${config.api_host_url}/group/:groupId/role/:roleName`;
const URL_ALL_GROUPS = `${config.api_host_url}/groups`;
const URL_ALL_USERS_IN_GROUP = `${config.api_host_url}/users/in-group/:groupId`;
const URL_ALL_USERS_NOT_IN_GROUP = `${config.api_host_url}/users/not-in-group/:groupId`;
const URL_ADD_USER_TO_GROUP = `${config.api_host_url}/group/:groupId/add-user/:userId`;
const URL_REMOVE_USER_FROM_GROUP = `${config.api_host_url}/group/:groupId/remove-user/:userId`;
const URL_GET_USERS_BY_STATUS = `${config.api_host_url}/users/status/:status`;
const URL_SET_USER_STATUS = `${config.api_host_url}/user/:userId/status/:status`;
const URL_GET_SELF_REGISTRATION = `${config.api_host_url}/self-registers`;
const URL_POST_APPROVE_SELF_REGISTRATION = `${config.api_host_url}/approve/:selfRegistrationId`;
const URL_DELETE_SELF_REGISTRATION = `${config.api_host_url}/self-register/:selfRegistrationId`;
let UserManagementService = class UserManagementService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    // === Roles =============
    allRoles() {
        return this.httpClient.get(URL_ALL_ROLES);
    }
    findGroupWithoutRole(roleName) {
        return this.httpClient.get(`${URL_ALL_GROUPS_WITHOUT_ROLE}`.replace(':roleName', roleName), {});
    }
    findGroupWithRole(roleName) {
        return this.httpClient.get(`${URL_ALL_GROUPS_WITH_ROLE}`.replace(':roleName', roleName), {});
    }
    removeRoleFromGroup(role, group) {
        return this.httpClient
            .delete(URL_DELETE_ROLE_FROM_GROUP.replace(':groupId', String(group.id)).replace(':roleName', role.name));
    }
    addRoleToGroup(role, group) {
        return this.httpClient
            .post(URL_ADD_ROLE_TO_GROUP.replace(':groupId', String(group.id)).replace(':roleName', role.name), {});
    }
    // ===== Groups ===============================
    findInGroup(groupName) {
        // todo:
        return of([
            { id: 1, name: 'group #01', description: 'group #01 description', status: 'enabled', roles: [] },
            { id: 2, name: 'group #02', description: 'group #02 description', status: 'enabled', roles: [] },
            { id: 3, name: 'group #03', description: 'group #03 description', status: 'enabled', roles: [] },
            { id: 4, name: 'group #04', description: 'group #04 description', status: 'enabled', roles: [] },
            { id: 5, name: 'group #05', description: 'group #05 description', status: 'enabled', roles: [] },
            { id: 6, name: 'group #06', description: 'group #06 description', status: 'enabled', roles: [] },
            { id: 7, name: 'group #07', description: 'group #07 description', status: 'enabled', roles: [] },
            { id: 8, name: 'group #08', description: 'group #08 description', status: 'enabled', roles: [] },
            { id: 9, name: 'group #09', description: 'group #09 description', status: 'enabled', roles: [] },
            { id: 10, name: 'group #10', description: 'group #10 description', status: 'enabled', roles: [] },
            { id: 11, name: 'group #11', description: 'group #11 description', status: 'enabled', roles: [] },
            { id: 12, name: 'group #12', description: 'group #12 description', status: 'enabled', roles: [] },
            { id: 13, name: 'group #13', description: 'group #13 description', status: 'enabled', roles: [] },
            { id: 14, name: 'group #14', description: 'group #14 description', status: 'enabled', roles: [] },
            { id: 15, name: 'group #15', description: 'group #15 description', status: 'enabled', roles: [] },
            { id: 16, name: 'group #16', description: 'group #16 description', status: 'enabled', roles: [] },
            { id: 17, name: 'group #17', description: 'group #17 description', status: 'enabled', roles: [] },
            { id: 18, name: 'group #18', description: 'group #18 description', status: 'enabled', roles: [] },
        ]);
    }
    getAllGroups() {
        return this.httpClient.get(URL_ALL_GROUPS).pipe(map((p) => p.payload));
    }
    findUsersInGroup(grp) {
        return this.httpClient.get(URL_ALL_USERS_IN_GROUP.replace(':groupId', String(grp.id)));
    }
    findUsersNotInGroup(group) {
        return this.httpClient.get(URL_ALL_USERS_NOT_IN_GROUP.replace(':groupId', String(group.id)));
    }
    addUserToGroup(user, group) {
        return this.httpClient.post(URL_ADD_USER_TO_GROUP
            .replace(':userId', String(user.id)).replace(':groupId', String(group.id)), {});
    }
    removeUserFromGroup(user, group) {
        return this.httpClient.delete(URL_REMOVE_USER_FROM_GROUP.replace(':userId', String(user.id))
            .replace(':groupId', String(group.id)), {});
    }
    // ========= Users
    findPendingUsers(userName) {
        return this.httpClient.get(URL_GET_USERS_BY_STATUS.replace(':status', 'DISABLED'));
    }
    findActiveUsers(userName) {
        return this.httpClient.get(URL_GET_USERS_BY_STATUS.replace(':status', 'ENABLED'));
    }
    findInactiveUsers(userName) {
        return this.httpClient.get(URL_GET_USERS_BY_STATUS.replace(':status', 'DISABLED'));
    }
    // const p = '/user/:userId/status/:status';
    setUserStatus(userId, status) {
        return this.httpClient.post(URL_SET_USER_STATUS.replace(':userId', String(userId)).replace(':status', status), {});
    }
    getAllActiveUsers() {
        return this.httpClient.get(URL_GET_USERS_BY_STATUS.replace(':status', 'ENABLED'));
    }
    getAllInactiveUsers() {
        return this.httpClient.get(URL_GET_USERS_BY_STATUS.replace(':status', 'DISABLED'));
    }
    // ========= self registration
    deletePendingUser(selfRegistration) {
        return this.httpClient.delete(URL_DELETE_SELF_REGISTRATION.replace(':selfRegistrationId', String(selfRegistration.id)), {});
    }
    getAllPendingUsers() {
        return this.httpClient.get(URL_GET_SELF_REGISTRATION);
    }
    approvePendingUser(selfRegistration) {
        return this.httpClient.post(URL_POST_APPROVE_SELF_REGISTRATION.replace(':selfRegistrationId', String(selfRegistration.id)), {});
    }
};
UserManagementService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], UserManagementService);
export { UserManagementService };
//# sourceMappingURL=user-management.service.js.map