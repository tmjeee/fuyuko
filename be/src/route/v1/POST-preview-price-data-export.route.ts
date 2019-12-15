import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {body, param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {Attribute} from "../../model/attribute.model";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {PriceDataExport} from "../../model/data-export.model";
import {preview, PreviewResult} from "../../service/export-csv/export-price.service";
const detectCsv = require('detect-csv');

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('pricingStructureId').exists().isNumeric(),
        body('attributes').exists().isArray(),
        body('filter').exists().isArray()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const attributes: Attribute[] = req.body.attributes;
        const filter: ItemValueOperatorAndAttribute[] = req.body.filter;


        const p: PreviewResult = await preview(viewId, pricingStructureId, filter);

        res.status(200).json({
            type: "PRICE",
            attributes: [...p.m.values()],
            pricedItems: p.i,
        } as PriceDataExport);
    }
];


const x = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/pricingStructure/:pricingStructureId/price/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default x;
