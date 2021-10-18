import {NextFunction, Router, Request, Response } from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {CustomRule} from '@fuyuko-common/model/custom-rule.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getAllCustomRules} from "../../service/custom-rule.service";
import {toHttpStatus} from "./aid.";

export const invocation = async (): Promise<ApiResponse<CustomRule[]>> => {
    const r: CustomRule[] = await getAllCustomRules();
    const apiResponse: ApiResponse<CustomRule[]> = {
        messages: [{
            status: 'SUCCESS',
            message: `Custom Rule Retrieval Success`,
        }],
        payload: r
    };
    return apiResponse;
}

// CHECKED
const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const apiResponse = await invocation();
        res.status(toHttpStatus(apiResponse)).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/custom-rules`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
