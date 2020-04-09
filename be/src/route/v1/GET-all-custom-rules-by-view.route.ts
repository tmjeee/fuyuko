import {NextFunction, Router, Request, Response } from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {CustomRuleForView} from '../../model/custom-rule.model';
import { param } from "express-validator";
import {ROLE_VIEW} from "../../model/role.model";
import {getAllCustomRulesForView} from "../../service/custom-rule.service";
import {ApiResponse} from "../../model/api-response.model";

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
        const r: CustomRuleForView[] = await getAllCustomRulesForView(viewId);
        res.status(200).json({
            status: 'SUCCESS',
            message: `Custom rules for view retrieved successfully`,
            payload: r
        } as ApiResponse<CustomRuleForView[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-rules`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
