import {Registry } from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {param} from 'express-validator';
import {ApiResponse} from "../../model/api-response.model";
import {ROLE_EDIT} from "../../model/role.model";
import {changeAttributeStatus, getAttributeInView} from '../../service/attribute.service';
import {DELETED, Status, STATUSES} from '../../model/status.model';
import {Workflow} from '../../model/workflow.model';
import {getWorkflowByViewActionAndType} from '../../service';
import {triggerAttributeWorkflow} from '../../service/workflow-trigger.service';

// CHECKED

const httpAction: any[] = [
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

        // trigger workflow (if needed) when delete
        if (state === DELETED) { // trying to delete trigger workflow if needed
            const workflowAction = 'Delete';
            const workflowType = 'Attribute';

            const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType);
            if (ws && ws.length > 0) {
                for (const w of ws) {
                    const att = await getAttributeInView(viewId, attributeId)
                    await triggerAttributeWorkflow([att], w.workflowDefinition.id, workflowAction);
                }
                res.status(200).json({
                    status: 'INFO',
                    message: `Workflow instance has been triggered to update attribute, workflow instance needs to be completed for actual update to take place`
                });
                return;
            }
        }



        const r: boolean = await changeAttributeStatus(attributeId, state as any);
        if (r) {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Attribute ${attributeId} status changed`
            } as ApiResponse);
        } else {
            res.status(400).json({
                status: 'ERROR',
                message: `Attribute ${attributeId} status failed to be changed`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p1 = `/view/:viewId/attribute/:attributeId/state/:state`;
    registry.addItem('POST', p1);
    router.post(p1, ...httpAction);
}

export default reg;
