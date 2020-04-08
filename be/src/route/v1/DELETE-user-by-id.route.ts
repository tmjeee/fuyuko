import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from "../../model/api-response.model";
import {check} from 'express-validator';
import {ROLE_ADMIN} from "../../model/role.model";

const httpAction: any[] = [
    [
        check('userId').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        await doInDbConnection(async (conn: Connection) => {
            const userId: number = Number(req.params.userId);

            await conn.query(`
                UPDATE TBL_USER SET STATUS = ? WHERE ID = ?
            `, ['DELETED', userId]);

            res.status(200).json({
                status: 'SUCCESS',
                message: `User ${userId} deleted`
            } as ApiResponse );
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/user/:userId';
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
