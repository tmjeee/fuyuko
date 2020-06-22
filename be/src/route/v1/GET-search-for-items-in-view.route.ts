import {param} from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {NextFunction, Request, Response, Router} from "express";
import {Item2} from "../../server-side-model/server-side.model";
import {getAllItem2sInView, searchForItem2sInView} from "../../service/item.service";
import {Item, ItemSearchType} from "../../model/item.model";
import {itemsConvert} from "../../service/conversion-item.service";
import {Registry} from "../../registry";
import {ApiResponse} from "../../model/api-response.model";
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


        let allItem2s: Item2[] = [];
        if (search) {
            allItem2s = await searchForItem2sInView(viewId, searchType, search, limitOffset);
        } else {
            allItem2s = await getAllItem2sInView(viewId, true, limitOffset);
        }
        const allItems: Item[] = itemsConvert(allItem2s);
        res.status(200).json({
            status: 'SUCCESS',
            message: `Items retrieved`,
            payload: allItems
        } as ApiResponse<Item[]>);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/searchType/:searchType/search/:search?`;
    registry.addItem('GET',p);
    router.get(p, ...httpAction);
};

export default reg;
