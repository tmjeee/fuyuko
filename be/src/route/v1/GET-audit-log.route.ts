import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_ADMIN, ROLE_VIEW} from "../../model/role.model";
import {LimitOffset} from "../../model/limit-offset.model";
import {toLimitOffset} from "../../util/utils";
import {getAuditLogs, getAuditLogsCount} from "../../service/audit.service";
import {AuditCategory, AuditLog} from "../../model/audit-log.model";
import {PaginableApiResponse} from "../../model/api-response.model";
import {Level} from "../../model/level.model";

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

        res.status(200).json({
           status: 'SUCCESS',
           message: 'audit logs retrived',
           payload: auditLogs,
           limit: limitOffset ? limitOffset.limit : total,
           offset: limitOffset ? limitOffset.offset : 0,
           total: total
        } as PaginableApiResponse<AuditLog[]>)
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/audit-log`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;