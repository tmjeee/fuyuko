import {i} from "../../logger";
import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {getPricedItems, toPricedItems} from "../../service/priced-item.service";
import {ItemValue2, PricedItem2} from "../model/server-side.model";
import {convert} from "../../service/conversion-item-value.service";
import {PricedItem} from "../../model/item.model";


const httpAction: any[] = [
    param('pricingStructureId').exists().isNumeric(),
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const pricedItem2s: PricedItem2[] = await getPricedItems(pricingStructureId);
        const pricedItems: PricedItem[] = toPricedItems(pricedItem2s);

        res.status(200).json(pricedItems);
    }
]


const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId/pricedItems`
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}


export default reg;
