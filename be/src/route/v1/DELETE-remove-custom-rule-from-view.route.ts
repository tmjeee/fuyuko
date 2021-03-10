import {NextFunction, Router, Request, Response } from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {param, body} from "express-validator";
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {deleteCustomRules} from "../../service/custom-rule.service";

// CHECKED:
const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('customRuleIds').exists().isArray(),
        body('customRuleIds.*').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const customRuleIds: number[] = req.body.customRuleIds;

        const errors: string[] = await deleteCustomRules(viewId, customRuleIds);

        if (errors && errors.length) {
            res.status(400).json({
                status: 'WARN',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Custom rule successfully deleted`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-rules`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
