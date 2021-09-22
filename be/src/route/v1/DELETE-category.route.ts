import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {deleteCategory, getViewCategoryById, getViewCategoryByName} from '../../service/category.service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {
    Workflow,
    WorkflowInstanceAction,
    WorkflowInstanceType,
    WorkflowTriggerResult
} from '@fuyuko-common/model/workflow.model';
import {getWorkflowByViewActionAndType, triggerAttributeWorkflow, triggerCategoryWorkflow} from '../../service';

export const invocation = async (viewId: number, categoryId: number) => {

    const workflowAction: WorkflowInstanceAction = 'Delete';
    const workflowType: WorkflowInstanceType = 'Category';


    // HANDLE WORKFLOW
    const category = await getViewCategoryById(categoryId);
    const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType);
    const payload: WorkflowTriggerResult[] = [];
    if (ws && ws.length > 0) {
        for (const w of ws) {
            const workflowTriggerResult = await triggerCategoryWorkflow([category], null,  w.workflowDefinition.id, workflowAction);
            payload.push(...workflowTriggerResult);
        }
        const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
            messages: [{
                status: 'INFO',
                message: 'Workflow instance has been triggered to create category, workflow instance needs to be completed for changes to take place',
            }],
            payload,
        };
        return apiResponse;
    }


    // HANDLE NON_WORKFLOW
    const errors: string[] = await deleteCategory(viewId, categoryId);
    if (errors && errors.length) {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'ERROR',
                message: errors.join(', ')
            }]
        };
        return apiResponse;
    } else {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'SUCCESS',
                message: `Category ${categoryId} in view ${viewId} deleted`
            }]
        };
        return apiResponse;
    }
}

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('categoryId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const categoryId: number = Number(req.params.categoryId);

        const apiResponse = await invocation(viewId, categoryId);
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/category/:categoryId`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
};

export default reg;
