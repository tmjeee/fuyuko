import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_EDIT, ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {body, param} from 'express-validator';
import {postWorkflowInstanceComment} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

const httpAction: any[] = [
    [
        param('workflowInstanceId').exists().isNumeric(),
        body('comment').exists().isString(),
        body('userId').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const workflowInstanceId = Number(req.params.workflowInstanceId);
        const userId = Number(req.body.userId);
        const comment = req.body.comment;

        const errors: string[]  = await postWorkflowInstanceComment(workflowInstanceId, userId, comment);

        if (errors.length) {
            const r: ApiResponse = {
                status: 'ERROR',
                message: errors.join(', ')
            };
            res.status(400).json(r);
        } else {
            const r: ApiResponse = {
                status: 'SUCCESS',
                message: `comment updated`
            }
            res.status(200).json(r);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/workflow-instance/:workflowInstanceId/comment`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
