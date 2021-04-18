import {Registry} from '../../registry';
import {Router, Request, Response, NextFunction} from 'express';
import {getWorkflowInstanceTasksForUser, getWorkflowInstanceTasksForUserCount} from '../../service';
import {param} from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {toLimitOffset} from '../../util/utils';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {WorkflowInstanceTask, WorkflowInstanceTaskStatus} from '@fuyuko-common/model/workflow.model';

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric(),
        param('status').exists().isString(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = Number(req.params.userId);
        const status: WorkflowInstanceTaskStatus = req.params.status as WorkflowInstanceTaskStatus;
        const limitOffset = toLimitOffset(req);

        const workflowInstanceTasks = await getWorkflowInstanceTasksForUser(userId, status, limitOffset);
        const total = await getWorkflowInstanceTasksForUserCount(userId, status);
        const r: PaginableApiResponse<WorkflowInstanceTask[]> = {
            messages: [{
                status: 'SUCCESS',
                message: 'Workflow instance task retrived successfully',
            }],
            payload: workflowInstanceTasks,
            limit: limitOffset ? limitOffset.limit : total,
            offset: limitOffset ? limitOffset.offset : 0,
            total
        };
        res.status(200).json(r);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/workflow-instance/user/:userId/status/:status`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;