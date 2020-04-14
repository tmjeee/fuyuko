import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response } from "express";
import {param, query} from "express-validator";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {getItem2sByIds, getItemsByIdsCount} from "../../service/item.service";
import {Item} from "../../model/item.model";
import {Item2} from "../../server-side-model/server-side.model";
import {itemsConvert} from "../../service/conversion-item.service";
import {ApiResponse, PaginableApiResponse} from "../../model/api-response.model";
import {LimitOffset} from "../../model/limit-offset.model";
import {toLimitOffset} from "../../util/utils";

// CHECKED
const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('itemIds').exists(),
        // query('limit').isNumeric(),
        // query('offset').isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const itemIds: number[] = req.params.itemIds.split(',').map((i: string) => Number(i));
        const limitOffset: LimitOffset = toLimitOffset(req.query.limit, req.query.offset);

        const item2s: Item2[] = await getItem2sByIds(viewId, itemIds, true, limitOffset);
        const items: Item[] = itemsConvert(item2s);
        const itemsTotal: number = await getItemsByIdsCount(viewId, itemIds);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Items received successfully`,
            payload: items,
            total: itemsTotal,
            offset: limitOffset ? limitOffset.offset : 0,
            limit: limitOffset ? limitOffset.limit : itemsTotal
        } as PaginableApiResponse<Item[]>);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items/:itemIds`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
