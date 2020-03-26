import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {ClientError, validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import { param } from "express-validator";
import {doInDbConnection, QueryResponse} from "../../db";
import {Connection} from "mariadb";

const httpAction: any[] = [
    [
        param('itemId').exists().isNumeric(),
        param('itemImageId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const itemId: number = Number(req.params.itemId);
        const itemImageId: number = Number(req.params.itemImageId);

        const q: QueryResponse = await doInDbConnection(async (conn: Connection) => {
            return await conn.query(`
               DELETE FROM TBL_ITEM_IMAGE WHERE ITEM_ID=? AND ID=?
            `, [itemId, itemImageId]);
        });

        if (q.affectedRows > 0) {
            res.status(200).json(true);
        } else {
            throw new ClientError(`Failed to delete itemId=${itemId} with itemImageId=${itemImageId}`);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/item/:itemId/image/:itemImageId`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
};

export default reg;