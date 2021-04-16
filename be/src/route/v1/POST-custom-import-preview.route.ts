import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import { param, body } from 'express-validator';
import {ImportScriptInputValue, ImportScriptPreview} from '@fuyuko-common/model/custom-import.model';
import {preview} from '../../custom-import';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

// CHECKED


const httpAction: any[] = [
    [
        param('customImportId').exists().isNumeric(),
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

        const customImportId: number = Number(req.params.customImportId);
        const viewId: number = Number(req.params.viewId);
        const values: ImportScriptInputValue[] = req.body.values;

        const p: ImportScriptPreview = await preview(viewId, customImportId, values);
        const apiResponse: ApiResponse<ImportScriptPreview> = {
            messages: [{
                status: 'SUCCESS',
                message: `Import script preview ready`,
            }],
            payload: p
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-import/:customImportId/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);

};

export default reg;

