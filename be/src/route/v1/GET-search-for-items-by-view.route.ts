import {param} from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {NextFunction, Request, Response, Router} from "express";
import {Item2} from "../model/server-side.model";
import {getAllItemsInView, searchForItemsInView} from "../../service/item.service";
import {Item, ItemSearchType} from "../../model/item.model";
import {convert} from "../../service/conversion-item.service";
import {Registry} from "../../registry";

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

        let allItem2s: Item2[] = [];
        if (search) {
            allItem2s = await searchForItemsInView(viewId, searchType, search);
        } else {
            allItem2s = await getAllItemsInView(viewId);
        }
        const allItems: Item[] = convert(allItem2s);
        res.status(200).json(allItems);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/searchType/:searchType/search/:search?`;
    registry.addItem('GET',p);
    router.get(p, ...httpAction);
};

export default reg;
