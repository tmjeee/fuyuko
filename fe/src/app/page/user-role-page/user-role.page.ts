import {Component, OnInit} from '@angular/core';
import {Group} from '../../model/group.model';
import {
  GroupSearchFn,
  GroupTableComponentEvent,
  GroupTableComponentEventType
} from '../../component/group-table-component/group-table.component';
import {Observable, of} from 'rxjs';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Role, ROLE_EDIT, ROLE_PARTNER, ROLE_VIEW} from '../../model/role.model';
import {map, tap} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';
import config from '../../../assets/config.json';


const URL_GET_ALL_ROLES = `${config.api_host_url}/roles`;

@Component({
  templateUrl: './user-role.page.html',
  styleUrls: ['./user-role.page.scss']
})
export class UserRolePageComponent implements OnInit {

  groupSearchByRole: (role: Role) => GroupSearchFn;

  allRoles: Role[];

  allRoleGroups: Map<Role, Group[]>;

  constructor(private userManagementService: UserManagementService,
              private notificationsService: NotificationsService) {
      this.allRoles = [];
      this.allRoleGroups = new Map();
  }

  ngOnInit(): void {
      this.userManagementService.allRoles()
          .pipe(
            tap((r: Role[]) => {
                console.log('**************** roles', r);
                this.allRoles = r;
                r.reduce((a: Map<Role, Group[]>, role: Role) => {
                   a.set(role, []);
                   return a;
                }, this.allRoleGroups);
                this.reloadRoleGroups();
            })
          ).subscribe();
      this.groupSearchByRole = (role: Role) => {
          return (group: string): Observable<Group[]> => {
              return this.userManagementService.findNotYetAssociatedToRoleGroup(role.name);
          };
      };
  }

  reloadRoleGroups() {
      Array.from(this.allRoleGroups.keys())
          .forEach((role: Role) =>  {
              this.userManagementService
                  .findNotYetAssociatedToRoleGroup(role.name)
                  .pipe(
                    map((groups: Group[]) => {
                        this.allRoleGroups.set(role, groups);
                    })
                  ).subscribe();
          });
  }


    onRoleGroupTableEvent($event: GroupTableComponentEvent, role: Role) {
      /*
        switch ($event.type) {
            case GroupTableComponentEventType.CANCEL:
                this.userManagementService.removeUserFromGroup(e.user, g);
                this.notificationsService.success('Success', `User ${e.user.username} deleted from group ${g.name}`);
                break;
            case Group:
                this.userManagementService.addUserToGroup(e.user, g);
                this.notificationsService.success('Success', `User ${e.user.username} added to group ${g.name}`);
                break;
        }
        */
    }
}
