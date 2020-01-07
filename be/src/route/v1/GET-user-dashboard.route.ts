import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn, validateUserInAnyRoleMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {SerializedDashboardFormat} from "../../model/dashboard-serialzable.model";
import {ROLE_VIEW} from "../../model/role.model";

const httpAction: any[] = [
    param('userId').exists().isNumeric(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    validateUserInAnyRoleMiddlewareFn([ROLE_VIEW]),
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const f: SerializedDashboardFormat = await doInDbConnection(async (conn: Connection) => {
             const q: QueryA = await conn.query(`SELECT ID, USER_ID, SERIALIZED_DATA FROM TBL_USER_DASHBOARD WHERE USER_ID = ?`, [userId]);

             if (q.length > 0) {
                 const data: string = q[0].SERIALIZED_DATA;
                 return data;
             } else {
                 return null;
             }
        });
        res.status(200).json({
            data: f
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/dashboard`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
