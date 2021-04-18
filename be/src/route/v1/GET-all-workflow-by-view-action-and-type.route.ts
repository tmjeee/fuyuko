import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {param} from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {getWorkflowByViewActionAndType} from '../../service';
import {
    Workflow,
    WORKFLOW_INSTANCE_ACTION,
    WORKFLOW_INSTANCE_TYPE,
    WorkflowInstanceAction,
    WorkflowInstanceType
} from '@fuyuko-common/model/workflow.model';
import {makeApiError, makeApiErrorObj} from '../../util';
import {ApiError} from '@fuyuko-common/model/api-error.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('action').exists().isString(),
        param('type').exists().isString(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId = Number(req.params.viewId);
        const action = req.params.action;
        const type = req.params.type;

        // extra validations
        const apiErrors: ApiError[] = [];
        if (!WORKFLOW_INSTANCE_ACTION.includes(action as any)) {
            apiErrors.push(makeApiError(`Bad workflow action`, 'action', action));
        }
        if (!WORKFLOW_INSTANCE_TYPE.includes(type as any)) {
            apiErrors.push(makeApiError(`Bad workflow type`, 'type', type));
        }
        if (apiErrors.length) {
            res.status(400).json(makeApiErrorObj(...apiErrors));
            return;
        }

        const workflows = await getWorkflowByViewActionAndType(viewId, action as WorkflowInstanceAction, type as WorkflowInstanceType);
        const r: ApiResponse<Workflow[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Workflows with action ${action}, type ${type} in viewId ${viewId} retrieved successfully`,
            }],
            payload: workflows
        };
        res.status(200).json(r);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/workflow/view/:viewId/action/:action/type/:type`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;