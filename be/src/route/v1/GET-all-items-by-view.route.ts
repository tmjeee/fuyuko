import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check, param, query} from 'express-validator';
import { Item } from "../../model/item.model";
import {Item2} from "../../server-side-model/server-side.model";
import {itemsConvert} from "../../service/conversion-item.service";
import {getAllItem2sInView, getAllItemsInViewCount} from "../../service/item.service";
import {ROLE_VIEW} from "../../model/role.model";
import {ApiResponse, PaginableApiResponse} from "../../model/api-response.model";
import {isLimit, isOffset, toLimitOffset} from "../../util/utils";
import {LimitOffset} from "../../model/limit-offset.model";

// CHECKED
const httpAction: any[] = [
   [
       param('viewId').exists().isNumeric(),
       // query('limit').isNumeric(),
       // query('offset').isNumeric()
   ],
   validateMiddlewareFn,
   validateJwtMiddlewareFn,
   v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
   async(req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const limitOffset: LimitOffset = toLimitOffset(req.query.limit, req.query.offset);

        const allItem2s: Item2[] = await getAllItem2sInView(viewId, true, limitOffset);
        const allItems: Item[] = itemsConvert(allItem2s);
        const allItemsTotal: number = await getAllItemsInViewCount(viewId, true);
        res.status(200).json({
            status: 'SUCCESS',
            message: `Items retrieved successfully`,
            payload: allItems,
            limit: limitOffset ? limitOffset.limit : allItemsTotal,
            offset: limitOffset ? limitOffset.offset : 0,
            total: allItemsTotal
        } as PaginableApiResponse<Item[]>);
   }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items`;
    registry.addItem('GET',p);
    router.get(p, ...httpAction);
};

export default reg;
