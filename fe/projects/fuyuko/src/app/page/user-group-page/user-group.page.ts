import {Component, OnInit} from '@angular/core';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Group} from '@fuyuko-common/model/group.model';
import {combineAll, finalize, flatMap, map, mergeAll, tap} from 'rxjs/operators';
import {User} from '@fuyuko-common/model/user.model';
import {Action, UserSearchFn, UserTableComponentEvent} from '../../component/user-table-component/user-table.component';
import {Observable, of} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {isApiResponseSuccess, toNotifications} from '../../service/common.service';
import {MatDialog} from '@angular/material/dialog';
import {EditGroupPopupComponent} from '../../component/group-table-component/edit-group-popup.component';
import {SUCCESS} from '@fuyuko-common/model/api-response-status.model';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {SelectionModel} from '@angular/cdk/collections';
import {LoadingService} from '../../service/loading-service/loading.service';


@Component({
  templateUrl: './user-group.page.html',
  styleUrls: ['./user-group.page.scss']
})
export class UserGroupPageComponent implements OnInit {

  userSearchFn: (group: Group) => UserSearchFn;

  groupsReady: boolean;
  groupsUsersReady: boolean;
  allGroups: Group[];

  groupsSelectionModel: SelectionModel<Group>;

  allGroupsUsers: Map<Group, User[]> = new Map(); // {[groupId: string]: User[]} = {};


  actions: Action[] = [
      { icon: '', tooltip: 'Remove user from group', type: 'DELETE'} as Action
  ];

  constructor(private userManagementService: UserManagementService,
              private matDialog: MatDialog,
              private notificationsService: NotificationsService,
              private loadingService: LoadingService) {
      this.groupsSelectionModel = new SelectionModel<Group>();
  }

  ngOnInit(): void {
    this.userSearchFn = (group: Group): UserSearchFn  => {
      return (user: string): Observable<User[]> => {
        return this.userManagementService.findUsersNotInGroup(user, group);
      };
    };
    this.reload();
  }

  reload() {
      this.loadingService.startLoading();
      const selectedGroups: Group[] = this.groupsSelectionModel.selected;
      this.groupsSelectionModel.clear();
      this.groupsReady = false;
      this.userManagementService
          .getAllGroups()
          .pipe(
              map((g: Group[]) => {
                  this.allGroups = g;
                  g.reduce((a: Map<Group, User[]>, grp: Group ) => {
                      a.set(grp, []);
                      // make sure already checked group remains checked on reload
                      if (selectedGroups && selectedGroups.find((gr: Group) => gr.id === grp.id)) {
                          this.groupsSelectionModel.select(grp);
                      }
                      return a;
                  }, this.allGroupsUsers);
                  this.reloadGroupUsers();
                  this.groupsReady = true;
              }),
              finalize(() => {
                  this.groupsReady = true;
                  this.loadingService.stopLoading();
              })
          ).subscribe();
  }

  reloadGroupUsers(fn?: () => void) {
    this.loadingService.startLoading();
    this.groupsUsersReady = false;
    const allGroups: Group[] = Array.from(this.allGroupsUsers.keys());
    of(...allGroups.map((g: Group) => this.userManagementService.findUsersInGroup(g))).pipe(
        combineAll(),
        tap((r: User[][]) => {
            for (let i = 0; i < allGroups.length; i++) {
                const group: Group = allGroups[i];
                const usersInGroup: User[] = r[i];
                this.allGroupsUsers.set(group, usersInGroup);
            }
            this.groupsUsersReady = true;
        }),
        finalize(() => {
            this.groupsUsersReady = true;
            this.loadingService.stopLoading();
        })
    ).subscribe();
  }


  private _reloadGroupUser(grp: Group) {
      this.loadingService.startLoading();
      this.groupsUsersReady = false;
      this.userManagementService.findUsersInGroup(grp)
          .pipe(
              map((users: User[]) => {
                  this.allGroupsUsers.set(grp, users);
                  this.groupsUsersReady = true;
              }),
              finalize(() => {
                  this.loadingService.stopLoading();
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

    onAddGroup($event: MouseEvent) {
      this.matDialog
          .open(EditGroupPopupComponent, {
              width: '95vw',
              height: '95vh'
          })
          .afterClosed()
          .pipe(
              flatMap((g: Group) => {
                  if (g) {
                     return this.userManagementService.updateGroup(g);
                  }
                  return of(null);
              }),
              tap((r: ApiResponse) => {
                  if (r) {
                      toNotifications(this.notificationsService, r);
                      if (isApiResponseSuccess(r)) {
                          this.reload();
                      }
                  }
              })
          ).subscribe();
    }

    groupChecked($event: MatCheckboxChange, g: Group) {
      if ($event.checked) {
          this.groupsSelectionModel.select(g);
      } else {
          this.groupsSelectionModel.deselect(g);
      }
      return false;
    }

    preventDefault($event: KeyboardEvent | MouseEvent) {
      $event.stopPropagation();
    }

    onDeleteGroup($event: MouseEvent) {
      const groupIds: number[] = this.groupsSelectionModel.selected.map((g: Group) => g.id);
      this.userManagementService.deleteGroup(groupIds).pipe(
          tap((r: ApiResponse) => {
              toNotifications(this.notificationsService, r);
              if (isApiResponseSuccess(r)) {
                  this.reload();
              }
          })
      ).subscribe();
    }
}
