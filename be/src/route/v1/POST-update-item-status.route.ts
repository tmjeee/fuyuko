import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import { check, body, param } from "express-validator";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from "../../model/response.model";

const httpAction: any[] = [
    [
        body('itemIds').isArray(),
        body('itemIds.*').exists().isNumeric(),
        param('viewId').exists().isNumeric(),
        param('status').exists()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const status: string = req.params.status;
        const itemIds: number[] = req.body.itemIds;

        await doInDbConnection(async (conn: Connection) => {
            for (const itemId of itemIds) {
                await conn.query(`UPDATE TBL_ITEM SET STATUS = ? WHERE ID=?`, [status,itemId]);
            }
        });
        res.status(200).json({
           status: 'SUCCESS',
           message: `Items deleted`
        } as ApiResponse)
    }

];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;