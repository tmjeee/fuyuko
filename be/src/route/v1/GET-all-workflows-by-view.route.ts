import {NextFunction, Request, Response, Router} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {param} from "express-validator";
import {getWorkflowByView} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {Workflow} from '@fuyuko-common/model/workflow.model';

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId = Number(req.params.viewId);

        const workflows = await getWorkflowByView(viewId);
        const r: ApiResponse<Workflow[]> = {
           status: "SUCCESS",
           message: `Workflows for view ${viewId} retrieved successfully`,
           payload: workflows
        };
        return res.status(200).json(r);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/workflow/workflow/:viewId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;