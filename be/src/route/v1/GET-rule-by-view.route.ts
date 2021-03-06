import {NextFunction, Request, Response, Router} from 'express';
import {Registry} from '../../registry';
import {check} from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {getRule} from '../../service';
import {Rule} from '@fuyuko-common/model/rule.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


// CHECKED

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric(),
        check('ruleId').exists().isNumeric()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const ruleId: number = Number(req.params.ruleId);

        const r: Rule = await getRule(viewId, ruleId);
        const apiResponse: ApiResponse<Rule> = {
            messages: [{
                status: 'SUCCESS',
                message: `Rule retrieved`,
            }],
            payload: r
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/rule/:ruleId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
