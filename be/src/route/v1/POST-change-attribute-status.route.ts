import {Registry } from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {
    aFnAnyTrue, threadLocalMiddlewareFn,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {param} from 'express-validator';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {changeAttributeStatus, getAttributeInView} from '../../service';
import {DELETED, Status, STATUSES} from '@fuyuko-common/model/status.model';
import {
    Workflow,
    WorkflowInstanceAction,
    WorkflowInstanceType,
    WorkflowTriggerResult
} from '@fuyuko-common/model/workflow.model';
import {getWorkflowByViewActionAndType, triggerAttributeWorkflow} from '../../service';

// CHECKED

const httpAction: any[] = [
    threadLocalMiddlewareFn,
    [
        param('viewId').exists().isNumeric(),
        param('attributeId').exists().isNumeric(),
        param('state').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const attributeId: number = Number(req.params.attributeId);
        const state: string = req.params.state;

        if (!(STATUSES as any).includes(state)) {
            res.status(400).json({
                status: 'ERROR',
                message: `Invalid status / state ${state} change for attribute ${attributeId}`
            });
            return;
        }

        // HANDLE WORKFLOW
        if (state === DELETED) { // trying to delete trigger workflow if needed
            const workflowAction: WorkflowInstanceAction = 'Delete' as const;
            const workflowType: WorkflowInstanceType = 'Attribute' as const;

            const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType);
            const payload: WorkflowTriggerResult[] = [];
            if (ws && ws.length > 0) {
                for (const w of ws) {
                    const att = await getAttributeInView(viewId, attributeId)
                    const workflowTriggerResults = await triggerAttributeWorkflow([att], w.workflowDefinition.id, workflowAction);
                    payload.push(...workflowTriggerResults);
                }
                const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                    messages: [{
                        status: 'INFO',
                        message: `Workflow instance has been triggered to update attribute, workflow instance needs to be completed for actual update to take place`,
                    }],
                    payload,
                };
                res.status(200).json(apiResponse);
                return;
            }
        }



        // HANDLE NON_WORKFLOW
        const r: boolean = await changeAttributeStatus(attributeId, state as any);
        if (r) {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'SUCCESS',
                    message: `Attribute ${attributeId} status changed`
                }]
            }
            res.status(200).json(apiResponse);
        } else {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'ERROR',
                    message: `Attribute ${attributeId} status failed to be changed`
                }]
            };
            res.status(400).json(apiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p1 = `/view/:viewId/attribute/:attributeId/state/:state`;
    registry.addItem('POST', p1);
    router.post(p1, ...httpAction);
}

export default reg;
