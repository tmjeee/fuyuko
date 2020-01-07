import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn, validateUserInAnyRoleMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from "../../model/response.model";
import {ROLE_ADMIN, ROLE_EDIT} from "../../model/role.model";

const httpAction: any[] = [
    [
        check('userId').exists().isNumeric(),
        check('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    validateUserInAnyRoleMiddlewareFn([ROLE_ADMIN]),
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
