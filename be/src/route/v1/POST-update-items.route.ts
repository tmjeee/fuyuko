import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {body, param} from 'express-validator';
import {Item} from "../../model/item.model";
import {Item2} from "../model/server-side.model";
import {revert as itemRevert} from "../../service/conversion-item.service";
import {ApiResponse} from "../../model/response.model";
import util from 'util';
import {addItem, addOrUpdateItem, updateItem} from "../../service/item.service";
import {ROLE_EDIT} from "../../model/role.model";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        //body('items').isArray(),
        //body('items.*.name').exists(),
        //body('items.*.description').exists(),
        //body('items.*.parentId').exists()
        // todo: need to check [0].attributeId etc.
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const items: Item[] = req.body.items;
        const item2s: Item2[]  = itemRevert(items);

        for (const item2 of item2s) {
            await addOrUpdateItem(viewId, item2);
        }

        res.status(200).json({
            status: 'SUCCESS',
            message: `item(s) updated`
        } as ApiResponse);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items/update`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
