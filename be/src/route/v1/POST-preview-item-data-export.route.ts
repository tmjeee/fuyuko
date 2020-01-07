import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {body, param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {Attribute} from "../../model/attribute.model";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {ItemDataExport} from "../../model/data-export.model";
import {preview, PreviewResult} from "../../service/export-csv/export-item.service";
import {ROLE_EDIT} from "../../model/role.model";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('attributes').exists().isArray(),
        body('filter').exists().isArray()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
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
