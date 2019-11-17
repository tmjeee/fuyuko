import {Injectable} from '@angular/core';
import {Role, RoleName} from '../../model/role.model';
import {Group, GroupStatus} from '../../model/group.model';
import {Observable, of} from 'rxjs';
import {User} from '../../model/user.model';
import config from '../../../assets/config.json';
import {HttpClient} from '@angular/common/http';
import {Paginable} from '../../model/pagnination.model';
import {ApiResponse} from '../../model/response.model';
import {map, tap} from 'rxjs/operators';

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

@Injectable()
export class UserManagementService {

  constructor(private httpClient: HttpClient) {}


  // === Roles =============

  allRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(URL_ALL_ROLES);
  }

  findGroupWithoutRole(roleName: RoleName): Observable<Paginable<Group>> {
    return this.httpClient.get<Paginable<Group>>(`${URL_ALL_GROUPS_WITHOUT_ROLE}`.replace(':roleName', roleName), {});
  }

  findGroupWithRole(roleName: RoleName) {
    return this.httpClient.get<Paginable<Group>>(`${URL_ALL_GROUPS_WITH_ROLE}`.replace(':roleName', roleName), {});
  }

  removeRoleFromGroup(role: Role, group: Group): Observable<ApiResponse> {
    return this.httpClient
          .delete<ApiResponse>(URL_DELETE_ROLE_FROM_GROUP.replace(':groupId', String(group.id)).replace(':roleName', role.name));
  }

  addRoleToGroup(role: Role, group: Group): Observable<ApiResponse> {
    return this.httpClient
        .post<ApiResponse>(URL_ADD_ROLE_TO_GROUP.replace(':groupId', String(group.id)).replace(':roleName', role.name), {});
  }



  // ===== Groups ===============================
  findInGroup(groupName: string): Observable<Group[]> {
    // todo:
    return of ([
      {id: 1,  name: 'group #01', description: 'group #01 description', status: 'enabled', roles: []} as Group,
      {id: 2,  name: 'group #02', description: 'group #02 description', status: 'enabled', roles: []} as Group,
      {id: 3,  name: 'group #03', description: 'group #03 description', status: 'enabled', roles: []} as Group,
      {id: 4,  name: 'group #04', description: 'group #04 description', status: 'enabled', roles: []} as Group,
      {id: 5,  name: 'group #05', description: 'group #05 description', status: 'enabled', roles: []} as Group,
      {id: 6,  name: 'group #06', description: 'group #06 description', status: 'enabled', roles: []} as Group,
      {id: 7,  name: 'group #07', description: 'group #07 description', status: 'enabled', roles: []} as Group,
      {id: 8,  name: 'group #08', description: 'group #08 description', status: 'enabled', roles: []} as Group,
      {id: 9,  name: 'group #09', description: 'group #09 description', status: 'enabled', roles: []} as Group,
      {id: 10, name: 'group #10', description: 'group #10 description', status: 'enabled', roles: []} as Group,
      {id: 11, name: 'group #11', description: 'group #11 description', status: 'enabled', roles: []} as Group,
      {id: 12, name: 'group #12', description: 'group #12 description', status: 'enabled', roles: []} as Group,
      {id: 13, name: 'group #13', description: 'group #13 description', status: 'enabled', roles: []} as Group,
      {id: 14, name: 'group #14', description: 'group #14 description', status: 'enabled', roles: []} as Group,
      {id: 15, name: 'group #15', description: 'group #15 description', status: 'enabled', roles: []} as Group,
      {id: 16, name: 'group #16', description: 'group #16 description', status: 'enabled', roles: []} as Group,
      {id: 17, name: 'group #17', description: 'group #17 description', status: 'enabled', roles: []} as Group,
      {id: 18, name: 'group #18', description: 'group #18 description', status: 'enabled', roles: []} as Group,
    ]);
  }

  getAllGroups(): Observable<Group[]> {
    return this.httpClient.get<Paginable<Group>>(URL_ALL_GROUPS).pipe(
        map((p: Paginable<Group>) => p.payload),
    );
  }

  findUsersInGroup(grp: Group): Observable<User[]> {
    return this.httpClient.get<User[]>(URL_ALL_USERS_IN_GROUP.replace(':groupId', String(grp.id)));
  }

  findUsersNotInGroup(group: Group): Observable<User[]> {
      return this.httpClient.get<User[]>(URL_ALL_USERS_NOT_IN_GROUP.replace(':groupId', String(group.id)));
  }

  addUserToGroup(user: User, group: Group): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(URL_ADD_USER_TO_GROUP
          .replace(':userId', String(user.id)).replace(':groupId', String(group.id)), {});
  }

  removeUserFromGroup(user: User, group: Group): Observable<ApiResponse> {
      return this.httpClient.delete<ApiResponse>(URL_REMOVE_USER_FROM_GROUP.replace(':userId', String(user.id))
          .replace(':groupId', String(group.id)), {});
  }


  // ========= Users

  findPendingUsers(userName: string): Observable<User[]> { // DISABLED
    return this.httpClient.get<User[]>(URL_GET_USERS_BY_STATUS.replace(':status', 'DISABLED'));
  }

  findActiveUsers(userName: string): Observable<User[]> {
    return this.httpClient.get<User[]>(URL_GET_USERS_BY_STATUS.replace(':status', 'ENABLED'));
  }

  findInactiveUsers(userName: string): Observable<User[]> {
    return this.httpClient.get<User[]>(URL_GET_USERS_BY_STATUS.replace(':status', 'DISABLED'));
  }

  // const p = '/user/:userId/status/:status';
  setUserStatus(userId: number, status: string): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(URL_SET_USER_STATUS.replace(':userId', String(userId)).replace(':status', status), {});
  }

  getAllActiveUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(URL_GET_USERS_BY_STATUS.replace(':status', 'ENABLED'));
  }

  getAllInactiveUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(URL_GET_USERS_BY_STATUS.replace(':status', 'DISABLED'));
  }

  deletePendingUser(user: User): Observable<ApiResponse> {
    return of(null);
  }

  getAllPendingUsers(): Observable<User[]> {
    // todo:
    return of ([
      {id:  1, firstName: 'f01', lastName: 'l01', username: 'u01', email: 'u01@mail.com', groups: []} as User,
      {id:  2, firstName: 'f02', lastName: 'l02', username: 'u02', email: 'u02@mail.com', groups: []} as User,
      {id:  3, firstName: 'f03', lastName: 'l03', username: 'u03', email: 'u03@mail.com', groups: []} as User,
      {id:  4, firstName: 'f04', lastName: 'l04', username: 'u04', email: 'u04@mail.com', groups: []} as User,
      {id:  5, firstName: 'f05', lastName: 'l05', username: 'u05', email: 'u05@mail.com', groups: []} as User,
      {id:  6, firstName: 'f06', lastName: 'l06', username: 'u06', email: 'u06@mail.com', groups: []} as User,
      {id:  7, firstName: 'f07', lastName: 'l07', username: 'u07', email: 'u07@mail.com', groups: []} as User,
      {id:  8, firstName: 'f08', lastName: 'l08', username: 'u08', email: 'u08@mail.com', groups: []} as User,
      {id:  9, firstName: 'f09', lastName: 'l09', username: 'u09', email: 'u09@mail.com', groups: []} as User,
      {id: 10, firstName: 'f10', lastName: 'l10', username: 'u10', email: 'u10@mail.com', groups: []} as User,
      {id: 11, firstName: 'f11', lastName: 'l11', username: 'u11', email: 'u11@mail.com', groups: []} as User,
      {id: 12, firstName: 'f12', lastName: 'l12', username: 'u12', email: 'u12@mail.com', groups: []} as User,
      {id: 13, firstName: 'f13', lastName: 'l13', username: 'u13', email: 'u13@mail.com', groups: []} as User,
      {id: 14, firstName: 'f14', lastName: 'l14', username: 'u14', email: 'u14@mail.com', groups: []} as User,
      {id: 15, firstName: 'f15', lastName: 'l15', username: 'u15', email: 'u15@mail.com', groups: []} as User,
      {id: 16, firstName: 'f16', lastName: 'l16', username: 'u16', email: 'u16@mail.com', groups: []} as User,
      {id: 17, firstName: 'f17', lastName: 'l17', username: 'u17', email: 'u17@mail.com', groups: []} as User,
      {id: 18, firstName: 'f18', lastName: 'l18', username: 'u18', email: 'u18@mail.com', groups: []} as User,
      {id: 19, firstName: 'f19', lastName: 'l19', username: 'u19', email: 'u19@mail.com', groups: []} as User,
    ]);
  }
}
