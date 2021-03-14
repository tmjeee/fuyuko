import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {param} from 'express-validator';
import {toLimitOffset} from '../../util/utils';
import {getWorkflowInstanceComments, getWorkflowInstanceCommentsCount} from '../../service';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {WorkflowInstanceComment} from '@fuyuko-common/model/workflow.model';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';

const httpAction: any[] = [
    [
        param('workflowInstanceId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const limitOffset = toLimitOffset(req);
        const workflowInstanceId = Number(req.params.workflowInstanceId);
        const comments = await getWorkflowInstanceComments(workflowInstanceId);
        const total = await getWorkflowInstanceCommentsCount(workflowInstanceId);
        const r: PaginableApiResponse<WorkflowInstanceComment[]> = {
            status: 'SUCCESS',
            message: `Retrieved workflow instance comments successfully`,
            payload: comments,
            limit: limitOffset ? limitOffset.limit : total,
            offset: limitOffset ? limitOffset.offset : 0,
            total
        };
        res.status(200).json(r);
    },
];

const reg = (router: Router, registry: Registry) => {
    const p = `/workflow-instance/:workflowInstanceId/comments`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
