import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import { param, body } from 'express-validator';
import {scheduleValidation} from '../../service';
import {ScheduleValidationResponse} from '@fuyuko-common/model/api-response.model';
import {ScheduleValidationResult} from "../../service/validation/run-validation.service";


// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('name').exists(),
        body('description'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId = Number(req.params.viewId);
        const name = req.body.name;
        const description = req.body.description;

        const r: ScheduleValidationResult = await scheduleValidation(viewId, name, description);

        if (r.errors && r.errors.length) {
            const apiResponse: ScheduleValidationResponse = {
                messages: [{
                    status: 'ERROR',
                    message: r.errors.join(', '),
                }],
                payload: r.validationId ? {
                    validationId: r.validationId
                } : undefined
            };
            res.status(400).json(apiResponse);
        } else {
            const apiResponse: ScheduleValidationResponse = {
                messages: [{
                    status: 'SUCCESS',
                    message: `Validation with id ${r.validationId} scheduled`,
                }],
                payload: r.validationId ? {
                    validationId: r.validationId
                } : undefined
            };
            res.status(200).json(apiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/validation`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
