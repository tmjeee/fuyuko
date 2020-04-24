import {Component, OnInit} from '@angular/core';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Group} from '../../model/group.model';
import {combineAll, flatMap, map, mergeAll, tap} from 'rxjs/operators';
import {User} from '../../model/user.model';
import {Action, UserSearchFn, UserTableComponentEvent} from '../../component/user-table-component/user-table.component';
import {forkJoin, Observable, of} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {ApiResponse} from '../../model/api-response.model';
import {toNotifications} from '../../service/common.service';


@Component({
  templateUrl: './user-group.page.html',
  styleUrls: ['./user-group.page.scss']
})
export class UserGroupPageComponent implements OnInit {

  userSearchFn: (group: Group) => UserSearchFn;

  groupsReady: boolean;
  groupsUsersReady: boolean;
  allGroups: Group[];

  allGroupsUsers: Map<Group, User[]> = new Map(); // {[groupId: string]: User[]} = {};


  actions: Action[] = [
      { icon: '', tooltip: 'Remove user from group', type: 'DELETE'} as Action
  ];

  constructor(private userManagementService: UserManagementService, private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.groupsReady = false;
    this.userManagementService
      .getAllGroups()
      .pipe(
        map((g: Group[]) => {
          this.allGroups = g;
          g.reduce((a: Map<Group, User[]>, grp: Group ) => {
            a.set(grp, []);
            return a;
          }, this.allGroupsUsers);
          this.reloadGroupUsers();
          this.groupsReady = true;
        })
      ).subscribe();



    this.userSearchFn = (group: Group): UserSearchFn  => {
      return (user: string): Observable<User[]> => {
        return this.userManagementService.findUsersNotInGroup(user, group);
      };
    };
  }

  reloadGroupUsers(fn?: ()=>void) {
    this.groupsUsersReady = false;
    const allGroups: Group[] = Array.from(this.allGroupsUsers.keys());
    of(...allGroups.map((g: Group) => this.userManagementService.findUsersInGroup(g))).pipe(
        combineAll(),
        tap((r: User[][]) => {
            for (let i=0; i<allGroups.length; i++) {
                const group: Group = allGroups[i];
                const usersInGroup: User[] = r[i];
                this.allGroupsUsers.set(group, usersInGroup);
            }
            this.groupsUsersReady = true;
        })
    ).subscribe();

    /*
    Array.from(this.allGroupsUsers.keys())
      .forEach((grp: Group) => {
          this._reloadGroupUser(grp);
      });
     */
  }



  private _reloadGroupUser(grp: Group) {
      this.groupsUsersReady = false;
      this.userManagementService.findUsersInGroup(grp)
          .pipe(
              map((users: User[]) => {
                  this.allGroupsUsers.set(grp, users);
                  this.groupsUsersReady = true;
              })
          ).subscribe();
  }

  onUserTableEvent(e: UserTableComponentEvent, g: Group) {
    switch (e.type) {
        case this.actions[0].type: // 'DELETE' action type
        this.userManagementService.removeUserFromGroup(e.user, g).pipe(
            tap((r: ApiResponse) => {
               toNotifications(this.notificationsService, r);
               this._reloadGroupUser(g);
            })
        ).subscribe();
        break;
      case 'SELECTION':
        this.userManagementService.addUserToGroup(e.user, g).pipe(
            tap((r: ApiResponse) => {
                toNotifications(this.notificationsService, r);
                this._reloadGroupUser(g);
            })
        ).subscribe();
        break;
    }
  }
}
