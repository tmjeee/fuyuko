import {NextFunction, Router, Request, Response } from 'express';
import {Registry} from '../../registry';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {param} from 'express-validator';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {changeCustomRuleStatus} from '../../service';
import {Status} from '@fuyuko-common/model/status.model';

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('customRuleId').exists().isNumeric(),
        param('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const customRuleId: number = Number(req.params.customRuleId);
        const status: string = req.params.status;

        const r: boolean = await changeCustomRuleStatus(viewId, customRuleId, status as Status);

        if (r) {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Custom rule with id ${customRuleId} for view ${viewId} updated`
            } as ApiResponse);
        } else {
            res.status(400).json({
                status: 'ERROR',
                message: `Custom rule with id ${customRuleId} for view ${viewId} FAILED to be updated`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-rules/:customRuleId/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
