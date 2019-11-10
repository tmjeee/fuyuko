import {Component, OnInit} from '@angular/core';
import {UserSearchFn} from '../../component/user-table-component/user-table.component';
import {User} from '../../model/user.model';
import {
    ActionType,
    UserSearchTableComponentEvent
} from '../../component/user-search-table-component/user-search-table.component';
import {NotificationsService} from 'angular2-notifications';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Component({
    templateUrl: './user-activation.page.html',
    styleUrls: ['./user-activation.page.scss']
})
export class UserActivationPageComponent implements OnInit {

    pendingUserSearchFn: UserSearchFn;

    pendingUsers: User[];
    actionTypes: ActionType[];


    constructor(private notificationService: NotificationsService,
                private userManagementService: UserManagementService) {
        this.pendingUserSearchFn = (userName: string): Observable<User[]> => {
            return this.userManagementService.findInactiveUsers(userName);
        };
        this.actionTypes = [{type: 'activate', icon: 'add_circle', tooltip: 'Activate Self Registered User'} as ActionType];
    }

    ngOnInit(): void {
        this.userManagementService.getAllPendingUsers().pipe(
            map((u: User[]) => {
                this.pendingUsers = u;
            })
        ).subscribe();
    }

    onPendingUsersTableEvent($event: UserSearchTableComponentEvent) {
        this.notificationService.success('Success', `delete pending user ${$event.user.username}`);
        this.userManagementService.deletePendingUser($event.user);
    }

}
