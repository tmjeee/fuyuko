import {Router, Request, Response, NextFunction} from "express";
import {Registry} from "../../registry";
import {getAllWorkflowDefinition} from "../../service";
import {ApiResponse} from "../../model/api-response.model";
import {WorkflowDefinition} from "../../model/workflow.model";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const workflowDefinitions = await getAllWorkflowDefinition()
        const r: ApiResponse<WorkflowDefinition[]> = {
            status: "SUCCESS",
            message: 'Workflow definitions retrieved successfully',
            payload: workflowDefinitions
        };
        res.status(200).json(r);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/workflow/definitions`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
