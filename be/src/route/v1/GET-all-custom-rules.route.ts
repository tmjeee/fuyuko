import {NextFunction, Router, Request, Response } from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {CustomRule} from '@fuyuko-common/model/custom-rule.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getAllCustomRules} from "../../service/custom-rule.service";

// CHECKED
const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const r: CustomRule[] = await getAllCustomRules();
        res.status(200).json({
            status: 'SUCCESS',
            message: `Custom Rule Retrieval Success`,
            payload: r
        } as ApiResponse<CustomRule[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/custom-rules`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
