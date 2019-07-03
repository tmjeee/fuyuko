import {Component, OnInit} from '@angular/core';
import {GroupSearchFn, SendInviteComponentEvent} from '../../component/send-invite-component/send-invite.component';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Observable} from 'rxjs';
import {Group} from '../../model/group.model';
import {NotificationsService} from 'angular2-notifications';
import {UserSearchFn, UserTableComponentEvent} from '../../component/user-table-component/user-table.component';
import {User} from '../../model/user.model';
import {UserSearchTableComponentEvent} from '../../component/user-search-table-component/user-search-table.component';
import {map} from 'rxjs/operators';


@Component({
  templateUrl: './user-people.page.html',
  styleUrls: ['./user-people.page.scss']
})
export class UserPeoplePageComponent implements OnInit {

  inactiveUserSearchFn: UserSearchFn;
  activeUserSearchFn: UserSearchFn;
  pendingUserSearchFn: UserSearchFn;
  groupSearchFn: GroupSearchFn;

  pendingUsers: User[];
  activeUsers: User[];
  inactiveUsers: User[];

  constructor(private userManagementService: UserManagementService,
              private notificationService: NotificationsService) {
    this.groupSearchFn = (groupName: string): Observable<Group[]> => {
      return this.userManagementService.findInGroup(groupName);
    };
    this.inactiveUserSearchFn = (userName: string): Observable<User[]> => {
      return this.userManagementService.findPendingUsers(userName);
    };
    this.activeUserSearchFn = (userName: string): Observable<User[]> => {
      return this.userManagementService.findActiveUsers(userName);
    };
    this.pendingUserSearchFn = (userName: string): Observable<User[]> => {
      return this.userManagementService.findInactiveUsers(userName);
    };
  }

  ngOnInit(): void {
    this.userManagementService.getAllPendingUsers().pipe(
      map((u: User[]) => {
        this.pendingUsers = u;
      })
    ).subscribe();
    this.userManagementService.getAllActiveUsers().pipe(
      map((u: User[]) => this.activeUsers = u)
    ).subscribe();
    this.userManagementService.getAllInactiveUsers().pipe(
      map((u: User[]) => this.inactiveUsers = u)
    ).subscribe();
  }

  onSendInvite($event: SendInviteComponentEvent) {
   this.notificationService.success('Success', `invitation sent to ${$event.email}`);
  }

  onPendingUsersTableEvent($event: UserSearchTableComponentEvent) {
    this.notificationService.success('Success', `delete pending user ${$event.user.username}`);
    this.userManagementService.deletePendingUser($event.user);
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

