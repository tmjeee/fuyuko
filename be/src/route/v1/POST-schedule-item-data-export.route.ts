import {param, body} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import { Item } from '../../model/item.model';

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('items').exists().isArray()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req:Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const item: Item[] = req.body.items;
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/items`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}
