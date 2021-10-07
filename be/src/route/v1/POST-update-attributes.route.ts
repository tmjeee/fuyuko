import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {
    aFnAnyTrue, threadLocalMiddlewareFn,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {body, param} from 'express-validator';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {getWorkflowByViewActionAndType, updateAttributes} from '../../service';
import {triggerAttributeWorkflow} from '../../service';
import {Workflow, WorkflowTriggerResult} from '@fuyuko-common/model/workflow.model';


// CHECKED

const httpAction: any[] = [
    threadLocalMiddlewareFn,
    [
        param('viewId').exists().isNumeric(),
        body('attributes').isArray(),
        body('attributes.*.id').exists().isNumeric(),
        body('attributes.*.type').exists(),
        body('attributes.*.name').exists(),
        body('attributes.*.description').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const atts: Attribute[] = req.body.attributes;
        const workflowAction = 'Update';
        const workflowType = 'Attribute';

        // HANDLE WORKFLOW
        const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType);
        const payload: WorkflowTriggerResult[] = [];
        if (ws && ws.length > 0) {
            for (const w of ws) {
                const workflowTriggerResults = await triggerAttributeWorkflow(viewId, atts, w.workflowDefinition.id, workflowAction);
                payload.push(...workflowTriggerResults);
            }
            const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                messages: [{
                    status: 'INFO',
                    message: `Workflow instance has been triggered to update attribute, workflow instance needs to be completed for actual update to take place`,
                }],
                payload
            };
            res.status(200).json(apiResponse);
            return;
        }

        // HANDLE NON_WORKFLOW
        const r: {errors: string[], updatedAttributeIds: number[]} = await updateAttributes(atts);
        if (r.errors && r.errors.length) {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'ERROR',
                    message: r.errors.join(', ')
                }]
            };
            res.status(200).json(apiResponse);
        } else {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'SUCCESS',
                    message: `Attributes ${r.updatedAttributeIds.join(',')} updated`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p1 = `/view/:viewId/attributes/update`;
    registry.addItem('POST', p1);
    router.post(p1, ...httpAction);
}

export default reg;
