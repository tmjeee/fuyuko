import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {
    addCategory,
    getWorkflowByViewActionAndType,
    triggerAttributeWorkflow,
    triggerCategoryWorkflow
} from '../../service';
import {ApiResponse} from "@fuyuko-common/model/api-response.model";
import {body, param} from 'express-validator';
import {
    Workflow,
    WorkflowInstanceAction,
    WorkflowInstanceType,
    WorkflowTriggerResult
} from '@fuyuko-common/model/workflow.model';
import {Category} from '@fuyuko-common/model/category.model';
import {PartialBy} from "@fuyuko-common/model/types";


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('name').exists(),
        body('description').exists(),
        body('parentId').optional().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const name: string = req.body.name;
        const description: string = req.body.description;
        const parentId: number | undefined = req.body.parentId ? Number(req.body.parentId) : undefined;

        const workflowAction: WorkflowInstanceAction = 'Update';
        const workflowType: WorkflowInstanceType = 'Category';

        // HANDLE WORKFLOW
        const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType);
        const payload: WorkflowTriggerResult[] = [];
        if (ws && ws.length > 0) {
            const newCategory: PartialBy<Category, 'id' | 'creationDate' | 'lastUpdate'> = {
                id: undefined,
                name, description,
                status: 'ENABLED',
                children: [],
            };
            for (const w of ws) {
                const workflowTriggerResult = await triggerCategoryWorkflow(viewId, [newCategory], parentId, w.workflowDefinition.id, workflowAction);
                payload.push(...workflowTriggerResult);
            }
            const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                messages: [{
                    status: 'INFO',
                    message: 'Workflow instance has been triggered to create attribute, workflow instance needs to be completed for actual creation to take place',
                }],
                payload,
            };
            res.status(200).json(apiResponse);
            return;
        }


        // HANDLE NON_WORKFLOW
        const errors: string[] = await addCategory(viewId, parentId, {
            name,
            description,
            children: []
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
                    message: `category ${name} added`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/add-category`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}


export default reg;
