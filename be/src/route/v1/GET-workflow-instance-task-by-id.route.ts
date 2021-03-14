import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {param} from 'express-validator';
import {getWorkflowInstanceTasksById} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {WorkflowInstanceTask} from '@fuyuko-common/model/workflow.model';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';

const httpAction: any[] = [
    [
        param('workflowInstanceTaskId').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const workflowInstanceTaskId = Number(req.params.workflowInstanceTaskId);
        const workflowInstanceTask = await getWorkflowInstanceTasksById(workflowInstanceTaskId);
        const r: ApiResponse<WorkflowInstanceTask> = {
            status: 'SUCCESS',
            message: `Retrieved workflow instance task id ${workflowInstanceTaskId} successfully`,
            payload: workflowInstanceTask
        };
        res.status(200).json(r);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/workflow-instance/task/:workflowInstanceTaskId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
