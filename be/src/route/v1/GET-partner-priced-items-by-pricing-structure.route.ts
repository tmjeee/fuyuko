import {i} from "../../logger";
import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {getPricedItems, toPricedItems} from "../../service/priced-item.service";
import {PricedItem2} from "../../server-side-model/server-side.model";
import {PricedItem} from "../../model/item.model";
import {ROLE_PARTNER} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";


// CHECKED


const httpAction: any[] = [
    param('pricingStructureId').exists().isNumeric(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_PARTNER])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const pricedItem2s: PricedItem2[] = await getPricedItems(pricingStructureId);
        const pricedItems: PricedItem[] = toPricedItems(pricedItem2s);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Priced Items retrieved`,
            payload: pricedItems
        } as ApiResponse<PricedItem[]>);
    }
]


const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId/pricedItems`
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}


export default reg;
