import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {param, body} from 'express-validator';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {
    saveAttributes,
    newConsoleLogger,
    getWorkflowByView,
    getWorkflowByViewActionAndType,
    getAttributesInView, triggerAttributeWorkflow
} from '../../service';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {
    Workflow,
    WorkflowInstanceAction,
    WorkflowInstanceType,
    WorkflowTriggerResult
} from '@fuyuko-common/model/workflow.model';

// CHECKED

const httpAction: any[] = [
    [
       param('viewId').exists().isNumeric(),
       body('attributes').isArray(),
       body('attributes.*.type').exists(),
       body('attributes.*.name').exists(),
       body('attributes.*.description').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const attrs: Attribute[] = req.body.attributes;
        const workflowAction: WorkflowInstanceAction = 'Update';
        const workflowType: WorkflowInstanceType = 'Attribute';

        // HANDLE WORKFLOW
        const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType);
        const payload: WorkflowTriggerResult[] = [];
        if (ws && ws.length > 0) {
            for (const w of ws) {
                const workflowTriggerResult = await triggerAttributeWorkflow(viewId, attrs, w.workflowDefinition.id, workflowAction);
                payload.push(...workflowTriggerResult);
            }
            const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                messages: [{
                    status: 'INFO',
                    message: 'Workflow instance has been triggered to create attribute, workflow instance needs to be completed for changes to take place',
                }],
                payload,
            };
            res.status(200).json(apiResponse);
            return;
        }


        // HANDLE NON_WORKFLOW
        const errors: string [] = await saveAttributes(viewId, attrs, newConsoleLogger);
        if (errors && errors.length) {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'ERROR',
                    message: errors.join(', ')
                }]
            }
            res.status(400).json(apiResponse);
        } else {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'SUCCESS',
                    message: `Attributes added`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p1 = `/view/:viewId/attributes/add`;
    registry.addItem('POST', p1);
    router.post(p1, ...httpAction);
}

export default reg;
