import {Injectable} from '@angular/core';
import {Role, RoleName} from '../../model/role.model';
import {Group} from '../../model/group.model';
import {Observable, of} from 'rxjs';
import {User} from '../../model/user.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {ApiResponse, PaginableApiResponse, RegistrationResponse} from '../../model/api-response.model';
import {map, tap} from 'rxjs/operators';
import {SelfRegistration} from '../../model/self-registration.model';

const URL_ALL_ROLES = () => `${config().api_host_url}/roles`;
const URL_ALL_GROUPS_WITHOUT_ROLE = () => `${config().api_host_url}/groups/no-role/:roleName/:groupName`;
const URL_ALL_GROUPS_WITH_ROLE = () => `${config().api_host_url}/groups/with-role/:roleName`;
const URL_ADD_ROLE_TO_GROUP = () => `${config().api_host_url}/group/:groupId/role/:roleName`;
const URL_DELETE_ROLE_FROM_GROUP = () => `${config().api_host_url}/group/:groupId/role/:roleName`;
const URL_ALL_GROUPS = () => `${config().api_host_url}/groups`;
const URL_ALL_USERS_IN_GROUP = () => `${config().api_host_url}/users/in-group/:groupId`;
const URL_ALL_USERS_NOT_IN_GROUP = () => `${config().api_host_url}/users/not-in-group/:groupId/:username`;
const URL_ADD_USER_TO_GROUP = () => `${config().api_host_url}/group/:groupId/add-user/:userId`;
const URL_REMOVE_USER_FROM_GROUP = () => `${config().api_host_url}/group/:groupId/remove-user/:userId`;
const URL_GET_USERS_BY_STATUS = () => `${config().api_host_url}/users/status/:status`;
const URL_GET_SEARCH_USERS_BY_USERNAME_AND_STATUS = () => `${config().api_host_url}/search/status/:status/user/:username`;
const URL_SET_USER_STATUS = () => `${config().api_host_url}/user/:userId/status/:status`;
const URL_GET_SELF_REGISTRATION = () => `${config().api_host_url}/self-registers`;
const URL_POST_APPROVE_SELF_REGISTRATION = () => `${config().api_host_url}/self-register/approve/:selfRegistrationId`;
const URL_DELETE_SELF_REGISTRATION = () => `${config().api_host_url}/self-register/:selfRegistrationId`;
const URL_GET_SEARCH_GROUP_BY_NAME = () => `${config().api_host_url}/group/:groupName/search`;
const URL_GET_SEARCH_SELF_REGISTRATION_BY_USERNAME = () => `${config().api_host_url}/search/self-registration/:username`;
const URL_POST_UPDATE_GROUP = () => `${config().api_host_url}/group`;
const URL_DELETE_GROUPS = () => `${config().api_host_url}/groups`;
const URL_GET_SEARCH_GROUPS_ASSOCIATED_WITH_PRICING_STRUCTURE = () => `${config().api_host_url}/pricing-structure/:pricingStructureId/groups-associated/:groupName`;
const URL_GET_SEARCH_GROUPS_NOT_ASSOCIATED_WITH_PRICING_STRUCTURE = () => `${config().api_host_url}/pricing-structure/:pricingStructureId/groups-not-associated/:groupName`;


@Injectable()
export class UserManagementService {

  constructor(private httpClient: HttpClient) {}


  // === Roles =============

  allRoles(): Observable<Role[]> {
    return this.httpClient
        .get<ApiResponse<Role[]>>(URL_ALL_ROLES())
        .pipe(
            map((r: ApiResponse<Role[]>) => r.payload)
        );
  }

  findGroupWithoutRole(groupName: string, roleName: RoleName): Observable<Group[]> {
    return this.httpClient.get<PaginableApiResponse<Group[]>>(`${URL_ALL_GROUPS_WITHOUT_ROLE()}`
        .replace(':roleName', roleName)
        .replace(':groupName', groupName), {})
        .pipe(
            map((r: ApiResponse<Group[]>) => r.payload)
        );
  }

  findGroupWithRole(roleName: RoleName): Observable<Group[]> {
    return this.httpClient
        .get<PaginableApiResponse<Group[]>>(`${URL_ALL_GROUPS_WITH_ROLE()}`.replace(':roleName', roleName), {})
        .pipe(
            map((r: PaginableApiResponse<Group[]>) => r.payload)
        );
  }

  removeRoleFromGroup(role: Role, group: Group): Observable<ApiResponse> {
    return this.httpClient
          .delete<ApiResponse>(URL_DELETE_ROLE_FROM_GROUP().replace(':groupId', String(group.id)).replace(':roleName', role.name));
  }

  addRoleToGroup(role: Role, group: Group): Observable<ApiResponse> {
    return this.httpClient
        .post<ApiResponse>(URL_ADD_ROLE_TO_GROUP().replace(':groupId', String(group.id)).replace(':roleName', role.name), {});
  }



  // ===== Groups ===============================

  deleteGroup(groupIds: number[]): Observable<ApiResponse> {
      return this.httpClient
          .request<ApiResponse>('DELETE', URL_DELETE_GROUPS(), {
              body: {
                  groupIds
              }
          });
  }

  findGroupsAssociatedWithPricingStructure(pricingStructureId: number, groupName: string): Observable<Group[]> {
      return this.httpClient
          .get<ApiResponse<Group[]>>(URL_GET_SEARCH_GROUPS_ASSOCIATED_WITH_PRICING_STRUCTURE()
              .replace(':pricingStructureId', String(pricingStructureId))
              .replace(':groupName', groupName))
          .pipe(
              map((r: ApiResponse<Group[]>) => r.payload)
          );
  }

  findGroupsNotAssociatedWithPricingStructure(pricingStructureId: number, groupName: string): Observable<Group[]> {
      return this.httpClient
          .get<ApiResponse<Group[]>>(URL_GET_SEARCH_GROUPS_NOT_ASSOCIATED_WITH_PRICING_STRUCTURE()
              .replace(`:pricingStructureId`, String(pricingStructureId))
              .replace(`:groupName`, groupName))
          .pipe(
              map((r: ApiResponse<Group[]>) => r.payload)
          );
  }

  updateGroup(g: Group): Observable<ApiResponse> {
      return this.httpClient
          .post<ApiResponse>(URL_POST_UPDATE_GROUP(), g);
  }

  findInGroup(groupName: string): Observable<Group[]> {
    return this.httpClient
        .get<ApiResponse<Group[]>>(URL_GET_SEARCH_GROUP_BY_NAME().replace(':groupName', groupName))
        .pipe(
            map((r: ApiResponse<Group[]>) => r.payload)
        );
  }

  getAllGroups(): Observable<Group[]> {
    return this.httpClient.get<PaginableApiResponse<Group[]>>(URL_ALL_GROUPS()).pipe(
        map((p: PaginableApiResponse<Group[]>) => p.payload),
    );
  }

  findUsersInGroup(grp: Group): Observable<User[]> {
    return this.httpClient
        .get<ApiResponse<User[]>>(URL_ALL_USERS_IN_GROUP().replace(':groupId', String(grp.id)))
        .pipe(
            map((r: ApiResponse<User[]>) => r.payload)
        );
  }

  findUsersNotInGroup(username: string, group: Group): Observable<User[]> {
      return this.httpClient
          .get<ApiResponse<User[]>>(URL_ALL_USERS_NOT_IN_GROUP()
            .replace(':groupId', String(group.id))
            .replace(':username', username))
          .pipe(
              map((r: ApiResponse<User[]>) => r.payload)
          );
  }

  addUserToGroup(user: User, group: Group): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(URL_ADD_USER_TO_GROUP()
          .replace(':userId', String(user.id)).replace(':groupId', String(group.id)), {});
  }

  removeUserFromGroup(user: User, group: Group): Observable<ApiResponse> {
      return this.httpClient.delete<ApiResponse>(URL_REMOVE_USER_FROM_GROUP().replace(':userId', String(user.id))
          .replace(':groupId', String(group.id)), {});
  }


  // ========= Users

  findSelfRegistrations(userName: string): Observable<SelfRegistration[]> { // DISABLED
    return this.httpClient
        .get<ApiResponse<SelfRegistration[]>>(
            URL_GET_SEARCH_SELF_REGISTRATION_BY_USERNAME().replace(':username', userName))
        .pipe(
            map((r: ApiResponse<SelfRegistration[]>) => r.payload)
        );
  }

  findActiveUsers(userName: string): Observable<User[]> {
    return this.httpClient
        .get<ApiResponse<User[]>>(
          URL_GET_SEARCH_USERS_BY_USERNAME_AND_STATUS()
            .replace(':status', 'ENABLED')
            .replace(':username', userName)
        ).pipe(
            map((r: ApiResponse<User[]>) => r.payload)
        );
  }

  findInactiveUsers(userName: string): Observable<User[]> {
    return this.httpClient
        .get<ApiResponse<User[]>>(
          URL_GET_SEARCH_USERS_BY_USERNAME_AND_STATUS()
            .replace(':status', 'DISABLED')
            .replace(':username', userName)
        ).pipe(
            map((r: ApiResponse<User[]>) => r.payload)
        );
  }

  // const p = '/user/:userId/status/:status';
  setUserStatus(userId: number, status: string): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(URL_SET_USER_STATUS().replace(':userId', String(userId)).replace(':status', status), {});
  }

  getAllActiveUsers(): Observable<User[]> {
    return this.httpClient
        .get<ApiResponse<User[]>>(
            URL_GET_USERS_BY_STATUS().replace(':status', 'ENABLED'))
        .pipe(
            map((r: ApiResponse<User[]>) => r.payload)
        );
  }

  getAllInactiveUsers(): Observable<User[]> {
    return this.httpClient
        .get<ApiResponse<User[]>>(URL_GET_USERS_BY_STATUS().replace(':status', 'DISABLED'))
        .pipe(map((r: ApiResponse<User[]>) => r.payload));
  }

  // ========= self registration

  deletePendingUser(selfRegistration: SelfRegistration): Observable<ApiResponse> {
      return this.httpClient.delete<ApiResponse>(
          URL_DELETE_SELF_REGISTRATION().replace(':selfRegistrationId', String(selfRegistration.id)), {});
  }

  getAllPendingUsers(): Observable<SelfRegistration[]> {
      return this.httpClient
          .get<ApiResponse<SelfRegistration[]>>(URL_GET_SELF_REGISTRATION())
          .pipe(
              map((r: ApiResponse<SelfRegistration[]>) => r.payload)
          );
  }

  approvePendingUser(selfRegistration: SelfRegistration): Observable<RegistrationResponse> {
    return this.httpClient.post<RegistrationResponse>(
        URL_POST_APPROVE_SELF_REGISTRATION()
            .replace(':selfRegistrationId', String(selfRegistration.id)), {});
  }



}

