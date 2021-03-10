import {Injectable} from '@angular/core';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {Level} from '@fuyuko-common/model/level.model';
import {AuditCategory, AuditLog} from '@fuyuko-common/model/audit-log.model';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {Observable} from 'rxjs';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {toQuery} from '../../utils/pagination.utils';


const URL_GET_AUDIT_LOGS = () => `${config().api_host_url}/audit-log`;

@Injectable()
export class AuditLogService {

    constructor(private httpClient: HttpClient) {
    }

    findAuditLogs(category: AuditCategory, level: Level, userId: number, log: string, limitOffset?: LimitOffset):
        Observable<PaginableApiResponse<AuditLog[]>> {

        const qCategory = category ? `&category=${category}` : ``;
        const qLevel = level ? `&level=${level}` : ``;
        const qUserId = userId ? `&userId=${userId}` : ``;
        const qLogs = log ? `&logs=${log}` : ``;

        return this.httpClient.get<PaginableApiResponse<AuditLog[]>>(
            `${URL_GET_AUDIT_LOGS()}?${toQuery(limitOffset)}${qCategory}${qLevel}${qUserId}${qLogs}`);
    }
}
