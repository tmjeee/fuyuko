import {Component, OnInit} from '@angular/core';
import {Group} from '../../model/group.model';
import {
  GroupSearchFn,
  GroupTableComponentEvent,
  GroupTableComponentEventType
} from '../../component/group-table-component/group-table.component';
import {Observable} from 'rxjs';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Role} from '../../model/role.model';
import {map} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';


@Component({
  templateUrl: './user-role.page.html',
  styleUrls: ['./user-role.page.scss']
})
export class UserRolePageComponent implements OnInit {

  groupsWithViewRole: Group[];
  groupsWithEditRole: Group[];
  groupsWithPartnerRole: Group[];
  groupSearchByViewRoleFn: GroupSearchFn;
  groupSearchByEditRoleFn: GroupSearchFn;
  groupSearchByPartnerRoleFn: GroupSearchFn;

  constructor(private userManagementService: UserManagementService,
              private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.groupSearchByViewRoleFn = (g: string): Observable<Group[]> => {
      return this.userManagementService
        .findNotYetAssociatedToRoleGroup(Role.VIEW)
        .pipe(
          map((grps: Group[]) => this.groupsWithViewRole = grps)
        );
    };
    this.groupSearchByEditRoleFn = (g: string): Observable<Group[]> => {
      return this.userManagementService
        .findNotYetAssociatedToRoleGroup(Role.EDIT)
        .pipe(
          map((grps: Group[]) => this.groupsWithEditRole = grps)
        );
    };
    this.groupSearchByPartnerRoleFn = (g: string): Observable<Group[]> => {
      return this.userManagementService
        .findNotYetAssociatedToRoleGroup(Role.PARTNER)
        .pipe(
          map((grps: Group[]) => this.groupsWithPartnerRole = grps)
        );
    };

    this.reloadViewRoleGroups();
    this.reloadEditRoleGroups();
    this.reloadPartnerRoleGroups();
  }

  reloadViewRoleGroups() {
    this.userManagementService.findNotYetAssociatedToRoleGroup(Role.VIEW)
      .pipe(
        map((grp: Group[]) =>  this.groupsWithViewRole = grp )
      ).subscribe();
  }

  reloadEditRoleGroups() {
    this.userManagementService.findNotYetAssociatedToRoleGroup(Role.EDIT)
      .pipe(
        map((grp: Group[]) =>  this.groupsWithEditRole = grp )
      ).subscribe();
  }

  reloadPartnerRoleGroups() {
    this.userManagementService.findNotYetAssociatedToRoleGroup(Role.PARTNER)
      .pipe(
        map((grp: Group[]) =>  this.groupsWithPartnerRole = grp )
      ).subscribe();
  }

  onViewRoleGroupEvent(event: GroupTableComponentEvent) {
    switch (event.type) {
      case GroupTableComponentEventType.SEARCH: {
        this.notificationsService.success('Success', `Add ${event.group.name} to VIEW role`);
        this.reloadViewRoleGroups();
        break;
      }
      case GroupTableComponentEventType.CANCEL: {
        this.userManagementService.removeRoleFromGroup(Role.VIEW, event.group)
          .pipe(
            map((r) => {
              this.notificationsService.success('Success', 'Role removed from group');
              this.reloadViewRoleGroups();
            })
          ).subscribe();
        break;
      }
    }
  }
  onEditRoleGroupEvent(event: GroupTableComponentEvent) {
    switch (event.type) {
      case GroupTableComponentEventType.SEARCH: {
        this.notificationsService.success('Success', `Add ${event.group.name} to EDIT role`);
        this.reloadEditRoleGroups();
        break;
      }
      case GroupTableComponentEventType.CANCEL: {
        this.userManagementService.removeRoleFromGroup(Role.EDIT, event.group)
          .pipe(
            map((r) => {
              this.notificationsService.success('Success', 'Role removed from group');
              this.reloadEditRoleGroups();
            })
          ).subscribe();
        break;
      }
    }
  }
  onPartnerRoleGroupEvent(event: GroupTableComponentEvent) {
    switch (event.type) {
      case GroupTableComponentEventType.SEARCH: {
        this.notificationsService.success('Success', `Add ${event.group.name} to PARTNER role`);
        this.reloadPartnerRoleGroups();
        break;
      }
      case GroupTableComponentEventType.CANCEL: {
        this.userManagementService.removeRoleFromGroup(Role.PARTNER, event.group)
          .pipe(
            map((r) => {
              this.notificationsService.success('Success', 'Role removed from group');
              this.reloadPartnerRoleGroups();
            })
          ).subscribe();
        break;
      }
    }
  }
}
