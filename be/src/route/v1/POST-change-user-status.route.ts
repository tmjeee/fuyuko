import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {param} from 'express-validator';
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from "../../model/api-response.model";
import {ROLE_ADMIN} from "../../model/role.model";

// CHECKED

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric(),
        param('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const status: string = req.params.status;
        const userId: number = Number(req.params.userId);

        await doInDbConnection(async (conn: Connection) => {

            await conn.query(`UPDATE TBL_USER SET STATUS = ? WHERE ID = ? `, [status, userId]);

            res.status(200).json({
                status: 'SUCCESS',
                message: `User ${userId} status altered (${status})`
            } as ApiResponse);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/user/:userId/status/:status';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
