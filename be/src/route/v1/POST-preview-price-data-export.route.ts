import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {body, param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {Attribute} from "../../model/attribute.model";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {PriceDataExport} from "../../model/data-export.model";
import {PricedItem2} from "../model/server-side.model";
import {doInDbConnection} from "../../db";
import {PoolConnection} from "mariadb";
import {PricedItem} from "../../model/item.model";
import {convert} from "../../service/conversion-item.service";
import {getPricedItem2WithFiltering} from "../../service/priced-item-filtering.service";

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

        const {b: item2s, m: attributesMap}: {b: PricedItem2[], m: Map<string /* attributeId */, Attribute> } = await doInDbConnection(async (conn: PoolConnection) => {
            return await getPricedItem2WithFiltering(conn, viewId, pricingStructureId, null, filter);
        });

        const items: PricedItem[] = convert(item2s) as PricedItem[];

        res.status(200).json({
            type: "PRICE",
            attributes: [...attributesMap.values()],
            items,
        } as PriceDataExport);
    }
];


const x = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/pricingStructure/:pricingStructureId/price/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default x;
