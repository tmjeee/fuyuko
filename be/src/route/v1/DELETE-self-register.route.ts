import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {SelfRegistrationResponse} from "../../model/self-registration.model";

const httpAction: any[] = [
    [
       check('selfRegistrationId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        await doInDbConnection(async (conn: Connection) => {

            const selfRegistrationId: number = Number(req.params.selfRegistrationId);

            await conn.query(`DELETE FROM TBL_SELF_REGISTRATION WHERE ID = ?`, [selfRegistrationId]);

            res.status(200).json({
                status: 'SUCCESS',
                message: `Self registration ${selfRegistrationId} deleted`
            } as SelfRegistrationResponse);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/self-register/:selfRegistrationId';
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
