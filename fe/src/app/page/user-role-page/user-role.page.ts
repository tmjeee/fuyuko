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
import {combineAll, finalize, flatMap, map, tap} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';
import {ApiResponse, PaginableApiResponse} from '../../model/api-response.model';
import {toNotifications} from '../../service/common.service';



@Component({
  templateUrl: './user-role.page.html',
  styleUrls: ['./user-role.page.scss']
})
export class UserRolePageComponent implements OnInit {

  groupSearchByRole: (role: Role) => GroupSearchFn;

  ready: boolean;

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
      this.ready = false;
      this.groupSearchByRole = (role: Role) => {
          return (group: string): Observable<Group[]> => {
              return this.userManagementService
                  .findGroupWithoutRole(group, role.name);
          };
      };
      this.userManagementService.allRoles()
          .pipe(
            flatMap((r: Role[]) => {
                this.allRoles = r;
                this.allRoleGroups = r.reduce((a: Map<Role, Group[]>, role: Role) => {
                   a.set(role, []);
                   return a;
                }, new Map());
                return r.map((r: Role) => this.userManagementService.findGroupWithRole(r.name))
            }),
            combineAll(),
            tap((g: Group[][]) => {
                for (let i = 0; i< this.allRoles.length; i++) {
                    const role: Role = this.allRoles[i];
                    const groupsWithRole: Group[] = g[i];
                    this.allRoleGroups.set(role, groupsWithRole);
                }
            }),
            finalize(() =>  {
                this.ready = true;
            })
          ).subscribe();
  }


  onRoleGroupTableEvent($event: GroupTableComponentEvent, role: Role) {
      switch ($event.type) {
          case this.actions[0].type: // 'DELETE' type
              this.ready = false;
              this.userManagementService.removeRoleFromGroup(role, $event.group)
                  .pipe(
                      flatMap((r: ApiResponse) => {
                          toNotifications(this.notificationsService, r);
                          return this.userManagementService.findGroupWithRole(role.name);
                      }),
                      tap((g: Group[]) => {
                          this.allRoleGroups.set(role, g);
                      }),
                      finalize(() => {
                          this.ready = true;
                      })
                  ).subscribe();
              break;
          case SEARCH_ACTION_TYPE: // when user search and 'select' this group from drop down
              // add role to group
              this.ready = false;
              this.userManagementService.addRoleToGroup(role, $event.group)
                  .pipe(
                      flatMap((r: ApiResponse) => {
                          toNotifications(this.notificationsService, r);
                          return this.userManagementService.findGroupWithRole(role.name);
                      }),
                      tap((g: Group[]) => {
                          this.allRoleGroups.set(role, g);
                      }),
                      finalize(() => {
                        this.ready = true;
                      })
                  ).subscribe();
              break;
      }
  }
}
