import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {param, body} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {Attribute} from "../../model/attribute.model";
import {AttributeDataExport} from "../../model/data-export.model";
import {preview} from "../../service/export-csv/export-attribute.service";
import {ROLE_EDIT} from "../../model/role.model";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('attributes').optional({nullable: true}).isArray(),
        body('filter').optional({nullable: true}).isArray()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const atts: Attribute[] = req.body.attributes;
        const filter: ItemValueOperatorAndAttribute[] = req.body.filter;
        const attributes: Attribute[] = await preview(viewId, atts);
        res.status(200).json({
            payload: {
                type: 'ATTRIBUTE',
                attributes
            } as AttributeDataExport
        } as ApiResponse<AttributeDataExport>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/attributes/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
