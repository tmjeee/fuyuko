import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import { check } from "express-validator";
import {doInDbConnection} from "../../db";
import {Pool, PoolConnection} from "mariadb";

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric(),
        check('itemId').exists().isNumeric(),
        check('status').exists()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const itemId: number = Number(req.params.itemId);
        const status: string = req.params.status;

        await doInDbConnection(async (conn: PoolConnection) => {
            await conn.query(`UPDATE TBL_ITEM SET STATUS = ? WHERE ID=?`, [status,itemId]);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `view/:viewId/item/:itemId/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;