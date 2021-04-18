import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import { param, body } from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {validate} from '../../custom-import';
import {ImportScriptInputValue, ImportScriptValidateResult} from '@fuyuko-common/model/custom-import.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

// CHECKED

const httpAction: any[] = [
    [
        param('customImportId').exists().isNumeric(),
        param('viewId').exists().isNumeric(),
        body('values').exists().isArray(),
        body('values.*.type').exists().isString(),
        body('values.*.name').exists().isString(),
        body('values.*.value'),

    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const customImportId: number = Number(req.params.customImportId);
        const values: ImportScriptInputValue[] = req.body.values;

        const v: ImportScriptValidateResult = await validate(viewId, customImportId, values);
        const apiResponse: ApiResponse<ImportScriptValidateResult> = {
            messages: [{
                status: 'SUCCESS',
                message: `Import script validate result ready`,
            }],
            payload: v
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-import/:customImportId/validate-input`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);

};

export default reg;