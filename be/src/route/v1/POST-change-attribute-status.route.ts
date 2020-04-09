import {Registry } from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check, param} from 'express-validator';
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from "../../model/api-response.model";
import {ROLE_EDIT} from "../../model/role.model";

// CHECKED

const httpAction: any[] = [
    [
        param('attributeId').exists().isNumeric(),
        param('state').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const attributeId: number = Number(req.params.attributeId);
        const state: string = req.params.state;

        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`UPDATE TBL_VIEW_ATTRIBUTE SET STATUS = ? WHERE ID = ? `, [state, attributeId]);
            res.status(200).json({
                status: 'SUCCESS',
                message: `Attribute ${attributeId} deleted`
            } as ApiResponse);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p1 = `/attribute/:attributeId/state/:state`;
    registry.addItem('POST', p1);
    router.post(p1, ...httpAction);
}

export default reg;
