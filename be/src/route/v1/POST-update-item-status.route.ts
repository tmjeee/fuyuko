import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {body, param } from "express-validator";
import {QueryA} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {updateItemsStatus} from '../../service';
import {Status} from '@fuyuko-common/model/status.model';


// CHECKED

const httpAction: any[] = [
    [
        body('itemIds').isArray(),
        body('itemIds.*').exists().isNumeric(),
        param('viewId').exists().isNumeric(),
        param('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const status: string = req.params.status;
        const itemIds: number[] = req.body.itemIds;

        const errors: string[] = await updateItemsStatus(itemIds, status as Status);
        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse)
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Items ${status.toLowerCase()}`
            } as ApiResponse)
        }
    }
];

const f = async (conn: Connection, itemId: number, status: string) => {
    if (itemId) {
        const q: QueryA = await conn.query(`SELECT ID FROM TBL_ITEM WHERE PARENT_ID=?`, [itemId]);
        for (const i of q) {
            const itemId: number = i.ID;
            await f(conn, itemId, status);
        }
        await conn.query(`UPDATE TBL_ITEM SET STATUS = ? WHERE ID=?`, [status, itemId]);
    }
}

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
