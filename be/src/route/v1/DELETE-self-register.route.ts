import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue, v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {ROLE_ADMIN} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";

const httpAction: any[] = [
    [
       check('selfRegistrationId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        await doInDbConnection(async (conn: Connection) => {

            const selfRegistrationId: number = Number(req.params.selfRegistrationId);

            await conn.query(`DELETE FROM TBL_SELF_REGISTRATION WHERE ID = ?`, [selfRegistrationId]);

            res.status(200).json({
                status: 'SUCCESS',
                message: `Self registration ${selfRegistrationId} deleted`
            } as ApiResponse);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/self-register/:selfRegistrationId';
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
