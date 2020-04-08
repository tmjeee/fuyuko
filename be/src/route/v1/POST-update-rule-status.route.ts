import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
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

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('ruleId').exists().isNumeric(),
        param('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const ruleId: number = Number(req.params.ruleId);
        const status: string = req.params.status;

        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`UPDATE TBL_RULE SET STATUS = ? WHERE ID = ? `, [status, ruleId]);

            res.status(200).json({
                status: 'SUCCESS',
                message: `Status updated`
            } as ApiResponse);
        });
    }
]


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/rule/:ruleId/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
