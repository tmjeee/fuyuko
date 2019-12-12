import {param, body} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {PricedItem} from "../../model/item.model";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('pricingStructureId').exists().isNumeric(),
        body('pricedItems').exists().isArray()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req:Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const pricedItems: PricedItem[] = req.body.pricedItems;

    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/pricingStructure/:pricingStructureId/prices`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}
