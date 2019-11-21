import {Registry } from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection} from "../../db";
import {PoolConnection} from "mariadb";
import {ApiResponse} from "../../model/response.model";

const httpAction: any[] = [
    [
        check('attributeId').exists().isNumeric(),
        check('state').exists()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const attributeId: number = Number(req.params.attributeId);
        const state: string = req.params.state;

        await doInDbConnection(async (conn: PoolConnection) => {
            await conn.query(`UPDATE TBL_ITEM_ATTRIBUTE SET STATUS = ? WHERE ID = ? `, [state, attributeId]);
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