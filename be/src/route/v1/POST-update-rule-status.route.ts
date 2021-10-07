import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {check, param} from 'express-validator';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {
    getAllPricingStructureItemsWithPrice, getRule,
    getWorkflowByViewActionAndType,
    triggerPriceWorkflow,
    updateRuleStatus
} from '../../service';
import {Status} from '@fuyuko-common/model/status.model';
import {
    Workflow,
    WorkflowInstanceAction,
    WorkflowInstanceType,
    WorkflowTriggerResult
} from '@fuyuko-common/model/workflow.model';
import {triggerRuleWorklow} from '../../service/workflow-trigger.service';

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('ruleId').exists().isNumeric(),
        param('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const ruleId: number = Number(req.params.ruleId);
        const status: Status = req.params.status as Status;

        // HANDLE WORKFLOW
        if (status === 'DELETED') {
            const workflowAction: WorkflowInstanceAction = 'Delete';
            const workflowType: WorkflowInstanceType = 'Rule';
            const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType);
            const payload: WorkflowTriggerResult[] = [];
            const rule = await getRule(viewId, ruleId);
            if (ws && ws.length > 0) {
                for (const w of ws) {
                    const workflowTriggerResults = await triggerRuleWorklow(viewId, [rule], w.workflowDefinition.id, workflowAction);
                    payload.push(...workflowTriggerResults);
                }
                const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                    messages: [{
                        status: 'INFO',
                        message: `Workflow instance has been triggered to update attribute, workflow instance needs to be completed for changes to take place`,
                    }],
                    payload
                };
                res.status(200).json(apiResponse);
                return;
            }
        }

        // HANDLE NON_WORKFLOW
        const r: boolean = await updateRuleStatus(ruleId, status as Status);
        if (r) {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'SUCCESS',
                    message: `Rule Status updated`
                }]
            };
            res.status(200).json(apiResponse);
        } else {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'ERROR',
                    message: `Rule Status Failed to be updated`
                }]
            };
            res.status(400).json(apiResponse);
        }
    }
]


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/rule/:ruleId/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
