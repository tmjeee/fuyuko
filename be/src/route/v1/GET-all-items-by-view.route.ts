import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {param} from 'express-validator';
import { Item } from '@fuyuko-common/model/item.model';
import {getAllItemsInView, getAllItemsInViewCount} from "../../service/item.service";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {toLimitOffset} from "../../util/utils";
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';

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
        const limitOffset = toLimitOffset(req);

        const allItems: Item[] = await getAllItemsInView(viewId, true, limitOffset);
        const allItemsTotal: number = await getAllItemsInViewCount(viewId, true);
        const apiResponse: PaginableApiResponse<Item[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Items retrieved successfully`,
            }],
            payload: allItems,
            limit: limitOffset ? limitOffset.limit : allItemsTotal,
            offset: limitOffset ? limitOffset.offset : 0,
            total: allItemsTotal
        };
        res.status(200).json(apiResponse);
   }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items`;
    registry.addItem('GET',p);
    router.get(p, ...httpAction);
};

export default reg;
