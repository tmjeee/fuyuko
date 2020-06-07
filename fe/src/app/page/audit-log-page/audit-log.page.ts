import {Component, OnInit} from "@angular/core";
import {FindAuditLogsFn, FindUsersFn} from "../../component/audit-log-component/audit-log.component";
import {AuditLogService} from "../../service/audit-log-service/audit-log.service";
import {UserManagementService} from "../../service/user-management-service/user-management.service";
import {tap} from "rxjs/operators";
import {PaginableApiResponse} from "../../model/api-response.model";
import {AuditLog} from "../../model/audit-log.model";

@Component({
    templateUrl: './audit-log.page.html',
    styleUrls: ['./audit-log.page.scss']
})
export class AuditLogPageComponent implements OnInit {

    findAuditLogsFn: FindAuditLogsFn;
    findUsersFn: FindUsersFn;

    loading: boolean = false;

    constructor(private auditLogService: AuditLogService,
                private userManagementService: UserManagementService) {
    }

    ngOnInit(): void {
        this.findAuditLogsFn = ((category, level, user, log, limitOffset) => {
            setTimeout(() => this.loading = true);
            return this.auditLogService.findAuditLogs(category, level, user, log, limitOffset).pipe(
                tap((r: PaginableApiResponse<AuditLog[]>) => {
                    setTimeout(() => this.loading = false);
                })
            );
        });
        this.findUsersFn = ((username: string) => {
            return this.userManagementService.findActiveUsers(username);
        });
    }

}