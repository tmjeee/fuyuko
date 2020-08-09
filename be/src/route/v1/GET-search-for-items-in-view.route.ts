import {param} from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {NextFunction, Request, Response, Router} from "express";
import {Item2} from "../../server-side-model/server-side.model";
import {
    getAllItem2sInView,
    getAllItemsInView, getAllItemsInViewCount,
    searchForItem2sInView,
    searchForItemsInView, searchForItemsInViewCount
} from "../../service/item.service";
import {Item, ItemSearchType} from "../../model/item.model";
import {itemsConvert} from "../../service/conversion-item.service";
import {Registry} from "../../registry";
import {ApiResponse, PaginableApiResponse} from "../../model/api-response.model";
import {LimitOffset} from "../../model/limit-offset.model";
import {toLimitOffset} from "../../util/utils";


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
        const limitOffset: LimitOffset = toLimitOffset(req);


        let allItems: Item[] = [];
        let total: number;
        if (search) {
            total = await searchForItemsInViewCount(viewId, searchType, search);
            allItems = await searchForItemsInView(viewId, searchType, search, limitOffset);
        } else {
            total = await getAllItemsInViewCount(viewId, true);
            allItems = await getAllItemsInView(viewId, true, limitOffset);
        }
        res.status(200).json({
            status: 'SUCCESS',
            message: `Items retrieved`,
            payload: allItems,
            total,
            limit: limitOffset ? limitOffset.limit : total,
            offset: limitOffset ? limitOffset.offset : 0,
        } as PaginableApiResponse<Item[]>);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/searchType/:searchType/search/:search?`;
    registry.addItem('GET',p);
    router.get(p, ...httpAction);
};

export default reg;
