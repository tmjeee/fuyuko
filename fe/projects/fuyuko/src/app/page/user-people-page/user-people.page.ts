import {Component, OnInit} from '@angular/core';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Observable, of} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {UserSearchFn} from '../../component/user-table-component/user-table.component';
import {User} from '@fuyuko-common/model/user.model';
import {
  ActionType,
  UserSearchTableComponentEvent
} from '../../component/user-search-table-component/user-search-table.component';
import {combineAll, finalize, map, tap} from 'rxjs/operators';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {LoadingService} from '../../service/loading-service/loading.service';


@Component({
  templateUrl: './user-people.page.html',
  styleUrls: ['./user-people.page.scss']
})
export class UserPeoplePageComponent implements OnInit {

  inactiveUserSearchFn: UserSearchFn;
  activeUserSearchFn: UserSearchFn;

  ready = false ;
  activeUsers: User[] = [];
  inactiveUsers: User[] = [];
  activeUsersActionTypes: ActionType[] = [];
  inactiveUsersActionTypes: ActionType[] = [];

  constructor(private userManagementService: UserManagementService,
              private notificationService: NotificationsService,
              private loadingService: LoadingService) {
    this.inactiveUserSearchFn = (userName: string): Observable<User[]> => {
      return this.userManagementService.findInactiveUsers(userName);
    };
    this.activeUserSearchFn = (userName: string): Observable<User[]> => {
      return this.userManagementService.findActiveUsers(userName);
    };

    this.activeUsersActionTypes = [{type: 'DEACTIVATE', icon: 'remove_circle', tooltip: 'Deactivate User'}];
    this.inactiveUsersActionTypes = [{type: 'ACTIVATE', icon: 'add_box', tooltip: 'Activate User'}];
  }

  ngOnInit(): void {
      this.reload();
  }

  reload() {
    this.ready = false;
    this.loadingService.startLoading();
    of(this.userManagementService.getAllActiveUsers(), this.userManagementService.getAllInactiveUsers())
    .pipe(
        combineAll(),
        tap((r: User[][]) => {
            const activeUsers: User[] = r[0];
            const inactiveUsers: User[] = r[1];
            this.activeUsers = activeUsers;
            this.inactiveUsers = inactiveUsers;
            this.ready = true;
        }),
        finalize(() => {
            this.ready = true;
            this.loadingService.stopLoading();
        })
    ).subscribe();
  }



  onActiveUsersTableEvent($event: UserSearchTableComponentEvent) {
      switch ($event.type) {
        case 'DEACTIVATE':
          this.userManagementService.setUserStatus($event.user.id, 'DISABLED')
              .pipe(
                  tap((r: ApiResponse) => {
                    toNotifications(this.notificationService, r);
                    this.reload();
                  })
              ).subscribe();
          break;
      }
  }

  onInactiveUsersTableEvent($event: UserSearchTableComponentEvent) {
    switch ($event.type) {
      case 'ACTIVATE':
        this.userManagementService.setUserStatus($event.user.id, 'ENABLED')
            .pipe(
                tap((r: ApiResponse) => {
                  toNotifications(this.notificationService, r);
                  this.reload();
                })
            ).subscribe();
        break;
    }
  }

}

