import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {check} from 'express-validator';
import {ApiResponse} from "../../model/response.model";
import {ROLE_ADMIN} from "../../model/role.model";

const httpAction: any[] = [
    [
        check('userId').exists().isNumeric(),
        check('groupId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        await doInDbConnection(async (conn: Connection) => {

            const userId: number = Number(req.params.userId);
            const groupId: number = Number(req.params.groupId);

            const qCount: QueryA = await conn.query(`SELECT COUNT(*) FROM TBL_LOOKUP_USER_GROUP WHERE USER_ID = ? AND GROUP_ID = ? `, [userId, groupId]);
            if (!qCount.length && !Number(qCount[0].COUNT)) { // aleady exists
                res.status(200).json({
                    status: 'ERROR',
                    message: `User ${userId} not in group ${groupId}`
                } as ApiResponse);
                return;
            }

            const q: QueryA = await conn.query(`DELETE FROM TBL_LOOKUP_USER_GROUP WHERE USER_ID=? AND GROUP_ID=?`, [userId, groupId]);
            res.status(200).json({
                status: 'SUCCESS',
                message: `User ${userId} deleted from group ${groupId}`
            } as ApiResponse);
            return;
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/group/:groupId/remove-user/:userId';
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
