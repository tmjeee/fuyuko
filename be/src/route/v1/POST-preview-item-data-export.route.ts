import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {body, param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {Attribute} from "../../model/attribute.model";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {ItemDataExport} from "../../model/data-export.model";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('attributes').exists().isArray(),
        body('filter').exists().isArray()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const attributes: Attribute[] = req.body.attributes;
        const filter: ItemValueOperatorAndAttribute[] = req.body.filter;


        res.status(200).json({
            type: 'ITEM',
            attributes: [],
            items: []
        } as ItemDataExport);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/item/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
