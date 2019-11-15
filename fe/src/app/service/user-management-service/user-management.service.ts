import {Injectable} from '@angular/core';
import {Role, RoleName} from '../../model/role.model';
import {Group, GroupStatus} from '../../model/group.model';
import {Observable, of} from 'rxjs';
import {User} from '../../model/user.model';
import config from '../../../assets/config.json';
import {HttpClient} from "@angular/common/http";

const URL_ALL_ROLES = `${config.api_host_url}/roles`;

@Injectable()
export class UserManagementService {

  constructor(private httpClient: HttpClient){}


  // === Roles =============

  allRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(URL_ALL_ROLES);
  }

  findNotYetAssociatedToRoleGroup(roleName: RoleName): Observable<Group[]> {
    // todo:
    return of([
      {id: 1,  name: 'group #01', description: 'This is group 01', status: 'enabled', roles: []} as Group,
      {id: 2,  name: 'group #02', description: 'This is group 02', status: 'enabled', roles: []} as Group,
      {id: 3,  name: 'group #03', description: 'This is group 03', status: 'enabled', roles: []} as Group,
      {id: 4,  name: 'group #04', description: 'This is group 04', status: 'enabled', roles: []} as Group,
      {id: 5,  name: 'group #05', description: 'This is group 05', status: 'enabled', roles: []} as Group,
      {id: 6,  name: 'group #06', description: 'This is group 06', status: 'enabled', roles: []} as Group,
      {id: 7,  name: 'group #07', description: 'This is group 07', status: 'enabled', roles: []} as Group,
      {id: 8,  name: 'group #08', description: 'This is group 08', status: 'enabled', roles: []} as Group,
      {id: 9,  name: 'group #09', description: 'This is group 09', status: 'enabled', roles: []} as Group,
      {id: 10, name: 'group #10', description: 'This is group 10', status: 'enabled', roles: []} as Group,
      {id: 11, name: 'group #11', description: 'This is group 11', status: 'enabled', roles: []} as Group,
      {id: 12, name: 'group #12', description: 'This is group 12', status: 'enabled', roles: []} as Group,
      {id: 13, name: 'group #13', description: 'This is group 13', status: 'enabled', roles: []} as Group,
      {id: 14, name: 'group #14', description: 'This is group 14', status: 'enabled', roles: []} as Group,
    ]);
  }

  removeRoleFromGroup(roleName: RoleName, group: Group): Observable<void> {
    // todo:
    return of(null);
  }

  addGroupToRole(role: Role, group: Group): Observable<void> {
    // todo:
    return of(null);
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

  findUsersNotInGroup(group: Group): Observable<User[]> {
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

  addUserToGroup(user: User, group: Group): Observable<void> {
    // todo:
    return of (null);
  }

  removeUserFromGroup(user: User, group: Group): Observable<void> {
    // todo:
    return of(null);
  }


  // ========= Users

  findPendingUsers(userName: string): Observable<User[]> {
    // todo:
    if (userName) {
      return of ([
        {id:  1, firstName: 'f01', lastName: 'l01', username: 'u01', email: 'u01@mail.com', groups: []} as User,
        {id:  2, firstName: 'f02', lastName: 'l02', username: 'u02', email: 'u02@mail.com', groups: []} as User,
        {id:  3, firstName: 'f03', lastName: 'l03', username: 'u03', email: 'u03@mail.com', groups: []} as User,
      ]);
    } else {
      return this.getAllPendingUsers();
    }
  }

  findActiveUsers(userName: string): Observable<User[]> {
    // todo:
    if (userName) {
      return of ([
        {id:  1, firstName: 'f01', lastName: 'l01', username: 'u01', email: 'u01@mail.com', groups: []} as User,
        {id:  2, firstName: 'f02', lastName: 'l02', username: 'u02', email: 'u02@mail.com', groups: []} as User,
        {id:  3, firstName: 'f03', lastName: 'l03', username: 'u03', email: 'u03@mail.com', groups: []} as User,
      ]);
    } else {
      return this.getAllActiveUsers();
    }
  }


  findInactiveUsers(userName: string): Observable<User[]> {
    // todo:
    if (userName) {
      return of([
        {id: 1, firstName: 'f01', lastName: 'l01', username: 'u01', email: 'u01@mail.com', groups: []} as User,
        {id: 2, firstName: 'f02', lastName: 'l02', username: 'u02', email: 'u02@mail.com', groups: []} as User,
        {id: 3, firstName: 'f03', lastName: 'l03', username: 'u03', email: 'u03@mail.com', groups: []} as User,
        {id: 4, firstName: 'f04', lastName: 'l04', username: 'u04', email: 'u04@mail.com', groups: []} as User,
      ]);
    } else {
      return this.getAllInactiveUsers();
    }
  }

  deletePendingUser(user: User): Observable<void> {
    // todo:
    return of(null);
  }

  deleteActiveUser(user: User): Observable<void> {
    // todo:
    return of(null);
  }

  deleteInactiveUser(user: User): Observable<void> {
    // todo:
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

  getAllActiveUsers(): Observable<User[]> {
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

  getAllInactiveUsers(): Observable<User[]> {
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
