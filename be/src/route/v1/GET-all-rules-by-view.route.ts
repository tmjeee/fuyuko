import {NextFunction, Router, Request, Response } from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check} from 'express-validator';
import {Rule} from '@fuyuko-common/model/rule.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {getRules} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

// CHECKED
const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const rules: Rule[] = await getRules(viewId);
        const apiResponse: ApiResponse<Rule[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Rules retrieved successfully`,
            }],
            payload: rules
        };
        res.status(200).json(apiResponse);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/rules`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
