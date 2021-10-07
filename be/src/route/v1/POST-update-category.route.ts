import {Registry} from '../../registry';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {body, param} from 'express-validator';
import {NextFunction, Router, Request, Response} from 'express';
import {
    getWorkflowByViewActionAndType,
    triggerAttributeWorkflow,
    triggerCategoryWorkflow,
    updateCategory
} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {Workflow, WorkflowTriggerResult} from '@fuyuko-common/model/workflow.model';
import {Category} from '@fuyuko-common/model/category.model';
import {getViewCategoryById} from '../../service/category.service';


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('id').exists().isNumeric(),
        body('name').exists(),
        body('description').exists(),
        body('parentId').optional()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const id: number = Number(req.body.id);
        const name: string = req.body.name;
        const description: string = req.body.description;
        const parentId: number | undefined = req.body.parentId ? Number(req.body.parentId) : undefined;
        const workflowAction = 'Update';
        const workflowType = 'Category';

        // HANDLE WORKFLOW
        const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType);
        const payload: WorkflowTriggerResult[] = [];
        if (ws && ws.length > 0) {
            for (const w of ws) {
                const category = await getViewCategoryById(id);
                category.name = name;
                category.description = description;
                const workflowTriggerResults = await triggerCategoryWorkflow(viewId, [category], parentId, w.workflowDefinition.id, workflowAction);
                payload.push(...workflowTriggerResults);
            }
            const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                messages: [{
                    status: 'INFO',
                    message: `Workflow instance has been triggered to update category, workflow instance needs to be completed for actual update to take place`,
                }],
                payload
            };
            res.status(200).json(apiResponse);
            return;
        }


        // HANDLE NON_WORKFLOW
        const errors: string[] = await updateCategory(viewId,  parentId, {
            id,
            name,
            description,
        });

        if (errors && errors.length) {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'ERROR',
                    message: errors.join(', ')
                }]
            };
            res.status(400).json(apiResponse);
        } else {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'SUCCESS',
                    message: `category ${name} updated`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/update-category`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}


export default reg;
