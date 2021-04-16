import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {getViewCategoryItems, getViewCategoryItemsCount} from '../../service';
import { param } from 'express-validator';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {toLimitOffset} from '../../util/utils';
import {Item} from '@fuyuko-common/model/item.model';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('categoryId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const categoryId: number = Number(req.params.categoryId);
        const limitOffset: LimitOffset = toLimitOffset(req);

        const total: number = await getViewCategoryItemsCount(viewId, categoryId);
        const items: Item[] = await getViewCategoryItems(viewId, categoryId, limitOffset);
        const apiResponse: PaginableApiResponse<Item[]> = {
            messages: [{
                status: 'SUCCESS',
                message: 'success',
            }],
            payload: items,
            limit: limitOffset ? limitOffset.limit : total,
            offset: limitOffset ? limitOffset.offset: 0,
            total
        };
        res.status(200).json(apiResponse);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/category/:categoryId/items`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}


export default reg;