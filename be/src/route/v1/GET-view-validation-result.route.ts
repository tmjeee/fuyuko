import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {
    aFnAnyTrue,
    threadLocalMiddlewareFn,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import { param } from 'express-validator';
import {ValidationResult} from '@fuyuko-common/model/validation.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getViewValidationResult} from '../../service';


// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('validationId').exists().isNumeric()
    ],
    threadLocalMiddlewareFn,
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const validationId: number = Number(req.params.validationId);

        const _r: ValidationResult | undefined = await getViewValidationResult(viewId, validationId);
        const apiResponse: ApiResponse<ValidationResult | undefined> = {
            messages: [{
                status: 'SUCCESS',
                message: `Validation result retrieved`,
            }],
            payload: _r
        };

        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/validation/:validationId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
