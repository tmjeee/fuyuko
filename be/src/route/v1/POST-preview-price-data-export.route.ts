import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {body, param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {Attribute} from "../../model/attribute.model";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {ItemDataExport, PriceDataExport} from "../../model/data-export.model";
import {Item2} from "../model/server-side.model";
import {doInDbConnection} from "../../db";
import {PoolConnection} from "mariadb";
import {getItem2WithFiltering} from "../../service/item-filtering.service";
import {Item} from "../../model/item.model";
import {convert} from "../../service/conversion-item.service";
import {getChildrenWithConn} from "../../service/pricing-structure-item.service";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('attributes').exists().isArray(),
        body('filter').exists().isArray()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const attributes: Attribute[] = req.body.attributes;
        const filter: ItemValueOperatorAndAttribute[] = req.body.filter;

        const {b: item2s, m: attributesMap}: {b: Item2[], m: Map<string /* attributeId */, Attribute> } = await doInDbConnection(async (conn: PoolConnection) => {
            return await getItem2WithFiltering(conn, viewId, null, filter);
        });

        const items: Item[] = convert(item2s);

        await doInDbConnection(async (conn: PoolConnection) => {
            // await getChildrenWithConn(conn,  null, null);
        });

        res.status(200).json({
            type: "PRICE",
            attributes: [...attributesMap.values()],
            items,
            prices: []
        } as PriceDataExport);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/price/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
