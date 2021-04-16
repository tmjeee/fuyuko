import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {body} from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {addWorkflow} from "../../service";
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

const httpActions: any[] = [
    [
        body('viewId').exists().isNumeric(),
        body('workflowName').exists().isString(),
        body('workflowAction').exists().isString(),
        body('workflowType').exists().isString(),
        body('workflowDefinitionId').exists().isNumeric(),
        body('workflowAttributeIds').isArray(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId = Number(req.body.viewId);
        const workflowName = req.body.workflowName;
        const workflowAction = req.body.workflowAction;
        const workflowType = req.body.workflowType;
        const workflowDefinitionId = Number(req.body.workflowDefinitionId);
        const workflowAttributeIds: number[] = req.body.workflowAttributeIds.map((i: string) => Number(i));

        const errors = await addWorkflow(workflowName, viewId, workflowDefinitionId, workflowAction, workflowType, workflowAttributeIds);

        if (errors && errors.length) {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: "ERROR",
                    message: errors.join(', ')
                }]
            };
            res.status(400).json(apiResponse);
        } else {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: "SUCCESS",
                    message: `Workflow named ${workflowName} successfully created`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/workflow/workflow`;
    registry.addItem('POST', p);
    router.post(p, httpActions);
}

export default reg;