import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {body, param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {Attribute} from "../../model/attribute.model";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {ItemDataExport} from "../../model/data-export.model";
import {doInDbConnection} from "../../db";
import {Pool, PoolConnection} from "mariadb";
import {getItem2WithFiltering} from "../../service/item-filtering.service";
import { Item2 } from "../model/server-side.model";
import {convert} from "../../service/conversion-item.service";
import {Item} from "../../model/item.model";
import {preview, PreviewResult} from "../../service/export-csv/export-item.service";

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

        const previewResult: PreviewResult = await preview(viewId, filter);

        res.status(200).json({
            type: 'ITEM',
            attributes: [...previewResult.m.values()],
            items: previewResult.i
        } as ItemDataExport);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/items/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
