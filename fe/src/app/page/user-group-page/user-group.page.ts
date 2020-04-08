import {Component, OnInit} from '@angular/core';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Group} from '../../model/group.model';
import {map, tap} from 'rxjs/operators';
import {User} from '../../model/user.model';
import {Action, UserSearchFn, UserTableComponentEvent} from '../../component/user-table-component/user-table.component';
import {Observable} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {ApiResponse} from '../../model/api-response.model';
import {toNotifications} from '../../service/common.service';


@Component({
  templateUrl: './user-group.page.html',
  styleUrls: ['./user-group.page.scss']
})
export class UserGroupPageComponent implements OnInit {

  userSearchFn: (group: Group) => UserSearchFn;

  allGroups: Group[];

  allGroupsUsers: Map<Group, User[]> = new Map(); // {[groupId: string]: User[]} = {};


  actions: Action[] = [
      { icon: '', tooltip: 'Remove user from group', type: 'DELETE'} as Action
  ];

  constructor(private userManagementService: UserManagementService, private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
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
        })
      ).subscribe();



    this.userSearchFn = (group: Group): UserSearchFn  => {
      return (user: string): Observable<User[]> => {
        return this.userManagementService.findUsersNotInGroup(user, group);
      };
    };
  }

  reloadGroupUsers() {
    Array.from(this.allGroupsUsers.keys())
      .forEach((grp: Group) => {
          this._reloadGroupUser(grp);
      });
  }

  private _reloadGroupUser(grp: Group) {
      this.userManagementService.findUsersInGroup(grp)
          .pipe(
              map((users: User[]) => {
                  this.allGroupsUsers.set(grp, users);
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
