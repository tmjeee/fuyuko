import {Component, OnInit} from '@angular/core';
import {FindAuditLogsFn, FindUsersFn} from '../../component/audit-log-component/audit-log.component';
import {AuditLogService} from '../../service/audit-log-service/audit-log.service';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {tap} from 'rxjs/operators';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {AuditLog} from '@fuyuko-common/model/audit-log.model';
import {LoadingService} from '../../service/loading-service/loading.service';

@Component({
    templateUrl: './audit-log.page.html',
    styleUrls: ['./audit-log.page.scss']
})
export class AuditLogPageComponent implements OnInit {

    findAuditLogsFn: FindAuditLogsFn;
    findUsersFn: FindUsersFn;


    constructor(private auditLogService: AuditLogService,
                private userManagementService: UserManagementService,
                private loadingService: LoadingService) {
    }

    ngOnInit(): void {
        this.findAuditLogsFn = ((category, level, user, log, limitOffset) => {
            this.loadingService.startLoading();
            return this.auditLogService.findAuditLogs(category, level, user, log, limitOffset).pipe(
                tap((r: PaginableApiResponse<AuditLog[]>) => {
                    this.loadingService.stopLoading();
                })
            );
        });
        this.findUsersFn = ((username: string) => {
            return this.userManagementService.findActiveUsers(username);
        });
    }

}
