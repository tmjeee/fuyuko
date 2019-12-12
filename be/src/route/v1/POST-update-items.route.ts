import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {body, param} from 'express-validator';
import {Item} from "../../model/item.model";
import {Item2} from "../model/server-side.model";
import {revert as itemRevert} from "../../service/conversion-item.service";
import {ApiResponse} from "../../model/response.model";
import util from 'util';
import {addItem, updateItem} from "../../service/item.service";

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
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const items: Item[] = req.body.items;
        const item2s: Item2[]  = itemRevert(items);

        console.log(util.inspect(item2s, {depth: 10}));

        for (const item2 of item2s) {

            if (item2.id > 0) {
               await updateItem(viewId, item2);
            } else {
               await addItem(viewId, item2);
            }
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