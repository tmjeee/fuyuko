import {Registry} from '../../registry';
import {NextFunction, Request, Response, Router} from 'express';
import {body, param} from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {CustomBulkEditScriptInputValue, CustomBulkEditScriptPreview} from '@fuyuko-common/model/custom-bulk-edit.model';
import {preview} from "../../custom-bulk-edit/custom-bulk-edit-executor";

const httpAction: any[] = [
    [
        param('customBulkEditId').exists().isNumeric(),
        param('viewId').exists().isNumeric(),
        body('values').isArray(),
        body('values.*.type').exists().isString(),
        body('values.*.name').exists().isString(),
        body('values.*.value'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const customBulkEditId: number = Number(req.params.customBulkEditId);
        const viewId: number = Number(req.params.viewId);
        const values: CustomBulkEditScriptInputValue[] = req.body.values;

        const p: CustomBulkEditScriptPreview = await preview(viewId, customBulkEditId, values);
        const apiResponse: ApiResponse<CustomBulkEditScriptPreview> = {
            messages: [{
                status: 'SUCCESS',
                message: `Custom Bulk Edit script preview ready`,
            }],
            payload: p
        };
        res.status(200).json(apiResponse);
    }
]

export const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-bulk-edit/:customBulkEditId/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;