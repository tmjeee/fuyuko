import {Component, OnInit} from '@angular/core';
import {GroupSearchFn, SendInviteComponentEvent} from '../../component/send-invite-component/send-invite.component';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Observable} from 'rxjs';
import {Group} from '../../model/group.model';
import {NotificationsService} from 'angular2-notifications';
import {UserSearchFn, UserTableComponentEvent} from '../../component/user-table-component/user-table.component';
import {User} from '../../model/user.model';
import {
  ActionType,
  UserSearchTableComponentEvent
} from '../../component/user-search-table-component/user-search-table.component';
import {map} from 'rxjs/operators';


@Component({
  templateUrl: './user-people.page.html',
  styleUrls: ['./user-people.page.scss']
})
export class UserPeoplePageComponent implements OnInit {

  inactiveUserSearchFn: UserSearchFn;
  activeUserSearchFn: UserSearchFn;

  activeUsers: User[];
  inactiveUsers: User[];
  activeUsersActionTypes: ActionType[];
  inactiveUsersActionTypes: ActionType[];

  constructor(private userManagementService: UserManagementService,
              private notificationService: NotificationsService) {
    this.inactiveUserSearchFn = (userName: string): Observable<User[]> => {
      return this.userManagementService.findPendingUsers(userName);
    };
    this.activeUserSearchFn = (userName: string): Observable<User[]> => {
      return this.userManagementService.findActiveUsers(userName);
    };

    this.activeUsersActionTypes = [{type: 'deactivate', icon: 'backspace', tooltip: 'Deactivate User'}];
    this.inactiveUsersActionTypes = [{type: 'activate', icon: 'add_box', tooltip: 'Activate User'}];
  }

  ngOnInit(): void {
    this.userManagementService.getAllActiveUsers().pipe(
      map((u: User[]) => this.activeUsers = u)
    ).subscribe();
    this.userManagementService.getAllInactiveUsers().pipe(
      map((u: User[]) => this.inactiveUsers = u)
    ).subscribe();
  }



  onActiveUsersTableEvent($event: UserSearchTableComponentEvent) {
    this.notificationService.success('Success', `delete active user ${$event.user.username}`);
    this.userManagementService.deleteActiveUser($event.user);
  }

  onInactiveUsersTableEvent($event: UserSearchTableComponentEvent) {
    this.notificationService.success('Success', `delete inactive user ${$event.user.username}`);
    this.userManagementService.deleteInactiveUser($event.user);
  }

}

