import {Component, OnInit} from '@angular/core';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Group} from '../../model/group.model';
import {map} from 'rxjs/operators';
import {User} from '../../model/user.model';
import {UserSearchFn, UserTableComponentEvent} from '../../component/user-table-component/user-table.component';
import {Observable} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';


@Component({
  templateUrl: './user-group.page.html',
  styleUrls: ['./user-group.page.scss']
})
export class UserGroupPageComponent implements OnInit {

  userSearchFn: (group: Group) => UserSearchFn;

  allGroups: Group[];

  allGroupsUsers: Map<Group, User[]> = new Map(); // {[groupId: string]: User[]} = {};

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
        return this.userManagementService.findUsersNotInGroup(group);
      };
    };
  }

  reloadGroupUsers() {
    Array.from(this.allGroupsUsers.keys())
      .forEach((grp: Group) => {
        this.userManagementService.findUsersNotInGroup(grp)
          .pipe(
            map((users: User[]) => {
              this.allGroupsUsers.set(grp, users);
            })
          ).subscribe();
      });
  }

  onUserTableEvent(e: UserTableComponentEvent, g: Group) {
    switch (e.type) {
      case 'delete':
        this.userManagementService.removeUserFromGroup(e.user, g);
        this.notificationsService.success('Success', `User ${e.user.username} deleted from group ${g.name}`);
        break;
      case 'selection':
        this.userManagementService.addUserToGroup(e.user, g);
        this.notificationsService.success('Success', `User ${e.user.username} added to group ${g.name}`);
        break;
    }
  }
}
