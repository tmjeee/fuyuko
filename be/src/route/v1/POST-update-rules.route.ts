import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {check, body} from 'express-validator';
import {Rule} from '@fuyuko-common/model/rule.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {addOrUpdateRules, getWorkflowByViewActionAndType, triggerCategoryWorkflow} from '../../service';
import {
    Workflow,
    WorkflowInstanceAction,
    WorkflowInstanceType,
    WorkflowTriggerResult
} from '@fuyuko-common/model/workflow.model';
import {getViewCategoryById} from '../../service/category.service';
import {triggerRuleWorklow} from '../../service/workflow-trigger.service';

// CHECKED

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric(),
        body('rules').isArray(),
        body('rules.*.name').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const rules: Rule[] = req.body.rules;

        // HANDLE WORKFLOW
        const workflowAction: WorkflowInstanceAction = 'Update';
        const workflowType: WorkflowInstanceType = 'Rule';
        const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType);
        const payload: WorkflowTriggerResult[] = [];
        if (ws && ws.length > 0) {
            for (const w of ws) {
                const workflowTriggerResults = await triggerRuleWorklow(rules, workflowAction);
                payload.push(...workflowTriggerResults);
            }
            const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                messages: [{
                    status: 'INFO',
                    message: `Workflow instance has been triggered to update category, workflow instance needs to be completed for changes to take place`,
                }],
                payload
            };
            res.status(200).json(apiResponse);
            return;
        }



        // HANDLE NON_WORKFLOW
        const errors: string[] = await addOrUpdateRules(viewId, rules);
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
                    message: `Update successful`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/rules`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
