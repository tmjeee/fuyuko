import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {check, body} from 'express-validator';
import {Rule} from '@fuyuko-common/model/rule.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {addOrUpdateRules} from '../../service';

// CHECKED

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric(),
        body('rules').isArray(),
        body('rules.*.name').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const rules: Rule[] = req.body.rules;
        const errors: string[] = await addOrUpdateRules(viewId, rules);

        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Update successful`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/rules`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
