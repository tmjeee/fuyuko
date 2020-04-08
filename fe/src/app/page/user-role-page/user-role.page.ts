import {Component, OnInit} from '@angular/core';
import {Group} from '../../model/group.model';
import {
    Action,
    GroupSearchFn,
    GroupTableComponentEvent,
    SEARCH_ACTION_TYPE
} from '../../component/group-table-component/group-table.component';
import {Observable} from 'rxjs';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Role} from '../../model/role.model';
import {map, tap} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';
import {Paginable} from '../../model/pagnination.model';
import {ApiResponse} from '../../model/api-response.model';
import {toNotifications} from '../../service/common.service';



@Component({
  templateUrl: './user-role.page.html',
  styleUrls: ['./user-role.page.scss']
})
export class UserRolePageComponent implements OnInit {

  groupSearchByRole: (role: Role) => GroupSearchFn;

  allRoles: Role[];

  allRoleGroups: Map<Role, Group[]>;

  actions: Action[];

  constructor(private userManagementService: UserManagementService,
              private notificationsService: NotificationsService) {
      this.allRoles = [];
      this.allRoleGroups = new Map();
      this.actions = [
          { type: 'DELETE', icon: 'remove_circle', tooltip: 'Remove role to this group'} as Action
      ];
  }

  ngOnInit(): void {
      this.userManagementService.allRoles()
          .pipe(
            tap((r: Role[]) => {
                this.allRoles = r;
                this.allRoleGroups = r.reduce((a: Map<Role, Group[]>, role: Role) => {
                   a.set(role, []);
                   return a;
                }, new Map());
                this.reloadRoleGroups();
            })
          ).subscribe();
      this.groupSearchByRole = (role: Role) => {
          return (group: string): Observable<Group[]> => {
              return this.userManagementService
                  .findGroupWithoutRole(group, role.name)
                  .pipe(map((p: Paginable<Group>) => p.payload));
          };
      };
  }

  reloadRoleGroups() {
      Array.from(this.allRoleGroups.keys())
          .forEach((role: Role) =>  {
              this._reloadRoleGroups(role);
          });
  }

  _reloadRoleGroups(role: Role) {
      this.userManagementService
          .findGroupWithRole(role.name)
          .pipe(
              map((p: Paginable<Group>) => p.payload),
              map((groups: Group[]) => {
                  this.allRoleGroups.set(role, groups);
              })
          ).subscribe();
  }


    onRoleGroupTableEvent($event: GroupTableComponentEvent, role: Role) {
        switch ($event.type) {
            case this.actions[0].type: // 'DELETE' type
                this.userManagementService.removeRoleFromGroup(role, $event.group)
                    .pipe(
                        tap((r: ApiResponse) => {
                            toNotifications(this.notificationsService, r);
                            this._reloadRoleGroups(role);
                        })
                    ).subscribe();
                break;
            case SEARCH_ACTION_TYPE: // when user search and 'select' this group from drop down
                // add role to group
                this.userManagementService.addRoleToGroup(role, $event.group)
                    .pipe(
                        tap((r: ApiResponse) => {
                            toNotifications(this.notificationsService, r);
                            this._reloadRoleGroups(role);
                        })
                    ).subscribe();
                break;
        }
    }
}
