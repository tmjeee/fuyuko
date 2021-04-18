import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {body, param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {ItemValueOperatorAndAttribute} from '@fuyuko-common/model/item-attribute.model';
import {ItemDataExport} from '@fuyuko-common/model/data-export.model';
import {exportItemPreview, ExportItemPreviewResult } from '../../service';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


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
        const attributes: Attribute[] = req.body.attributes;
        const filter: ItemValueOperatorAndAttribute[] = req.body.filter;

        const previewResult: ExportItemPreviewResult = await exportItemPreview(viewId, filter);

        const r: ItemDataExport = {
            type: 'ITEM',
            attributes: (attributes && attributes.length) ? attributes : [...previewResult.m.values()],
            items: previewResult.i
        };

        const apiResponse: ApiResponse<ItemDataExport> = {
            messages: [{
                status: 'SUCCESS',
                message: `Item data export ready`,
            }],
            payload: r
        };
        res.status(200).json(apiResponse);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/items/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
