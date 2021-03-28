import {NextFunction, Request, Response, Router} from 'express';
import {Registry} from '../../registry';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {param} from 'express-validator';
import {Argument} from '@fuyuko-workflow/engine-interface';
import {
    canUserActionOnWorkflowInstance,
    continueWorkflow,
} from '../../service/workflow-trigger.service';
import {getUserById} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ContinueWorkflowResult} from '@fuyuko-common/model/workflow.model';

const httpAction: any[] = [
    [
        param('workflowInstanceId').exists().isNumeric(),
        param('userId').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const workflowInstanceId = Number(req.params.workflowInstanceId);
        const userId = Number(req.params.userId);
        const args: Argument = req.body.args;

        const user = await getUserById(userId);
        if (!user) {
            const r: ApiResponse = {
                status: 'ERROR',
                message: `failed to get user with id ${userId}`
            };
            res.status(400).json(r);
        }
        const ok = await canUserActionOnWorkflowInstance(workflowInstanceId, user.username);
        if (ok) {
            const payload: ContinueWorkflowResult = await continueWorkflow(workflowInstanceId, args);
            const r: ApiResponse<ContinueWorkflowResult> = {
                status: 'SUCCESS',
                message: `Successfully continued workflow`,
                payload
            };
            res.status(200).json(r);
        } else {
            const r: ApiResponse = {
                status: 'ERROR',
                message: `user ${user.username} not allowed to action on workflow instance ${workflowInstanceId}`
            };
            res.status(400).json(r);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/workflow-instance/:workflowInstanceId/user/:userId/continue`;
    router.post(p, ...httpAction);
    registry.addItem('POST', p);
};

export default reg;