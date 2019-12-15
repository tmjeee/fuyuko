import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {param, body} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {Attribute} from "../../model/attribute.model";
import {AttributeDataExport} from "../../model/data-export.model";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {preview} from "../../service/export-csv/export-attribute.service";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('attributes').exists().isArray(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const attributes: Attribute[] = req.body.attributes;
        const _attributs: Attribute[] = preview(attributes);
        res.status(200).json({
            attributes
        } as AttributeDataExport);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/attribute/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
