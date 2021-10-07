import {param} from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {NextFunction, Request, Response, Router} from 'express';
import {
    getAllItemsInView, getAllItemsInViewCount,
    searchForItemsInView, searchForItemsInViewCount
} from '../../service';
import {Item, ItemSearchType} from '@fuyuko-common/model/item.model';
import {Registry} from '../../registry';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {toLimitOffset} from '../../util/utils';


// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('searchType').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async(req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const searchType: ItemSearchType = req.params.searchType as ItemSearchType;
        const search: string = req.params.search;
        const limitOffset = toLimitOffset(req);


        let allItems: Item[] = [];
        let total: number;
        if (search) {
            total = await searchForItemsInViewCount(viewId, searchType, search);
            allItems = await searchForItemsInView(viewId, searchType, search, limitOffset);
        } else {
            total = await getAllItemsInViewCount(viewId, true);
            allItems = await getAllItemsInView(viewId, true, limitOffset);
        }
        const apiResponse: PaginableApiResponse<Item[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Items retrieved`,
            }],
            payload: allItems,
            total,
            limit: limitOffset ? limitOffset.limit : total,
            offset: limitOffset ? limitOffset.offset : 0,
        };
        res.status(200).json(apiResponse);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/searchType/:searchType/search/:search?`;
    registry.addItem('GET',p);
    router.get(p, ...httpAction);
};

export default reg;
