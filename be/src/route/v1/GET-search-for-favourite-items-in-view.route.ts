import {param} from 'express-validator';
import {
    aFnAllTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles,
    vFnIsSelf
} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {NextFunction, Request, Response, Router} from 'express';
import {Item, ItemSearchType} from '@fuyuko-common/model/item.model';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {toLimitOffset} from "../../util/utils";
import {
    getAllFavouriteItemsInView, getAllFavouriteItemsInViewCount,
    searchForFavouriteItemsInView, searchForFavouriteItemsInViewCount,
} from '../../service';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {Registry} from '../../registry';

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('userId').exists().isNumeric(),
        param('searchType').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const fn = v([
            vFnHasAnyUserRoles([ROLE_VIEW]),
            vFnIsSelf(userId)
        ], aFnAllTrue);
        return fn(req, res, next);
    },
    async(req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const userId: number = Number(req.params.userId);
        const searchType: ItemSearchType = req.params.searchType as ItemSearchType;
        const search: string = req.params.search;
        const limitOffset: LimitOffset = toLimitOffset(req);

        let allItems: Item[] = [];
        let total: number;
        if (search) {
            total = await searchForFavouriteItemsInViewCount(viewId, userId, searchType, search);
            allItems = await searchForFavouriteItemsInView(viewId, userId, searchType, search, limitOffset);
        } else {
            total = await getAllFavouriteItemsInViewCount(viewId, userId);
            allItems = await getAllFavouriteItemsInView(viewId, userId, limitOffset);
        }
        res.status(200).json({
            status: 'SUCCESS',
            message: `Favourite items retrieved`,
            payload: allItems,
            total,
            limit: limitOffset ? limitOffset.limit : total,
            offset: limitOffset ? limitOffset.offset : 0,
        } as PaginableApiResponse<Item[]>);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/user/:userId/searchType/:searchType/search/:search?`;
    registry.addItem('GET',p);
    router.get(p, ...httpAction);
};

export default reg;
