import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection} from "../../db";
import {PoolConnection} from "mariadb";
import {ApiResponse} from "../../model/response.model";

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric(),
        check('ruleId').exists().isNumeric(),
        check('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const ruleId: number = Number(req.params.ruleId);
        const status: string = req.params.status;

        await doInDbConnection(async (conn: PoolConnection) => {
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