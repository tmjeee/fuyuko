import {Component, OnInit, Self} from '@angular/core';
import {UserSearchFn} from '../../component/user-search-table-component/user-search-table.component';
import {
    ActionType,
    UserSearchTableComponentEvent
} from '../../component/user-search-table-component/user-search-table.component';
import {NotificationsService} from 'angular2-notifications';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Observable} from 'rxjs';
import {finalize, map, tap} from 'rxjs/operators';
import {SelfRegistration} from '@fuyuko-common/model/self-registration.model';
import {ApiResponse, RegistrationResponse} from '@fuyuko-common/model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {LoadingService} from '../../service/loading-service/loading.service';



@Component({
    templateUrl: './user-activation.page.html',
    styleUrls: ['./user-activation.page.scss']
})
export class UserActivationPageComponent implements OnInit {

    pendingUserSearchFn: UserSearchFn;

    ready: boolean;
    pendingUsers: SelfRegistration[];
    actionTypes: ActionType[];


    constructor(private notificationService: NotificationsService,
                private userManagementService: UserManagementService,
                private loadingService: LoadingService) {
        this.pendingUserSearchFn = (userName: string): Observable<SelfRegistration[]> => {
            return this.userManagementService.findSelfRegistrations(userName);
        };
        this.actionTypes = [
            {type: 'ACTIVATE', icon: 'add_circle', tooltip: 'Activate Self Registered User'} as ActionType,
            {type: 'DELETE', icon: 'delete', tooltip: 'Delete this Self Registered User entry'} as ActionType
        ];
    }

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.ready = false;
        this.loadingService.startLoading();
        this.userManagementService.getAllPendingUsers().pipe(
            map((u: SelfRegistration[]) => {
                this.pendingUsers = u;
                this.ready = true;
            }),
            finalize(() => {
                this.ready = true;
                this.loadingService.stopLoading();
            })
        ).subscribe();
    }

    onPendingUsersTableEvent($event: UserSearchTableComponentEvent) {
        switch ($event.type) {
            case 'DELETE': {
                this.userManagementService.deletePendingUser($event.user as SelfRegistration)
                    .pipe(
                        tap((r: ApiResponse) => {
                            toNotifications(this.notificationService, r);
                            this.reload();
                        })
                    ).subscribe();
                break;
            }
            case 'ACTIVATE': {
                this.userManagementService.approvePendingUser($event.user as SelfRegistration)
                    .pipe(
                        tap((r: RegistrationResponse) => {
                            toNotifications(this.notificationService, r);
                            this.reload();
                        })
                    ).subscribe();
                break;
            }
        }
    }
}
