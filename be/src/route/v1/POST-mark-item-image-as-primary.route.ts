import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { param } from "express-validator";
import {ClientError, validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED

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

        await doInDbConnection(async (conn: Connection) => {

            const q: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_ITEM_IMAGE WHERE ID=? AND ITEM_ID=?
            `, [itemImageId, itemId]);
            if (q[0].COUNT > 0) { // make sure such image actually exists
                await conn.query(`UPDATE TBL_ITEM_IMAGE SET \`PRIMARY\`=false WHERE ITEM_ID=? `, [itemId]);
                await conn.query(`UPDATE TBL_ITEM_IMAGE SET \`PRIMARY\`=true WHERE ITEM_ID=? AND ID=?`, [itemId, itemImageId]);
                res.status(200).json({
                   status: 'SUCCESS',
                   message: `Image updated as primary`
                } as ApiResponse);
            } else {
                throw new ClientError(`Item Image with id ${itemImageId} and itemId ${itemId} do not exists`);
            }
        });
    }
];

const reg = (router: Router, registry: Registry) => {

    const p = `/item/:itemId/image/:itemImageId/mark-primary`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);

};

export default reg;