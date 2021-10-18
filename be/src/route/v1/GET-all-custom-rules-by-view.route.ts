import {NextFunction, Router, Request, Response } from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {CustomRuleForView} from '@fuyuko-common/model/custom-rule.model';
import { param } from "express-validator";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {getAllCustomRulesForView} from "../../service/custom-rule.service";
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {toHttpStatus} from "./aid.";

export const invocation = async (viewId: number) => {
    const r: CustomRuleForView[] = await getAllCustomRulesForView(viewId);
    const apiResponse: ApiResponse<CustomRuleForView[]> = {
        messages: [{
            status: 'SUCCESS',
            message: `Custom rules for view retrieved successfully`,
        }],
        payload: r
    };
    return apiResponse;
}

// CHECKED
const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const apiResponse = await invocation(viewId);
        res.status(toHttpStatus(apiResponse)).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-rules`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
