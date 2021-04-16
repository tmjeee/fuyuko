import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_ADMIN} from '@fuyuko-common/model/role.model';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {toLimitOffset} from "../../util/utils";
import {getAuditLogs, getAuditLogsCount} from '../../service';
import {AuditCategory, AuditLog} from '@fuyuko-common/model/audit-log.model';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {Level} from '@fuyuko-common/model/level.model';

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const limitOffset: LimitOffset = toLimitOffset(req);

        const filterByUserId: number = req.query.userId ? req.query.userId : null;
        const filterByCategory: AuditCategory = req.query.category ? req.query.category : null;
        const filterByLevel: Level = req.query.level ? req.query.level : null;
        const filterByLogs: string = req.query.logs ? req.query.logs : null;

        const total: number = await getAuditLogsCount(filterByUserId, filterByCategory, filterByLevel, filterByLogs);
        const auditLogs: AuditLog[] = await getAuditLogs(filterByUserId, filterByCategory, filterByLevel, filterByLogs, limitOffset);
        const apiResponse: PaginableApiResponse<AuditLog[]> = {
            messages: [{
                status: 'SUCCESS',
                message: 'audit logs retrived',
            }],
            payload: auditLogs,
            limit: limitOffset ? limitOffset.limit : total,
            offset: limitOffset ? limitOffset.offset : 0,
            total: total
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/audit-log`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;