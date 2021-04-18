import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {body, param } from "express-validator";
import {QueryA} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {
    getItemsByIds,
    getWorkflowByViewActionAndType,
    triggerAttributeValueWorkflow,
    triggerItemWorkflow,
    updateItemsStatus
} from '../../service';
import {Status} from '@fuyuko-common/model/status.model';
import {
    Workflow,
    WorkflowInstanceAction,
    WorkflowInstanceType,
    WorkflowTriggerResult
} from '@fuyuko-common/model/workflow.model';
import {Item, Value} from '@fuyuko-common/model/item.model';
import {ResponseStatus} from '@fuyuko-common/model/api-response-status.model';


// CHECKED

const httpAction: any[] = [
    [
        body('itemIds').isArray(),
        body('itemIds.*').exists().isNumeric(),
        param('viewId').exists().isNumeric(),
        param('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const status: string = req.params.status;
        const itemIds: number[] = req.body.itemIds;


        // HANDLE WORKFLOW:
        if ((status as Status) === 'DELETED') {
            let itemWorkflowTriggered = false;
            const payload: WorkflowTriggerResult[] = [];
            const workflowAction: WorkflowInstanceAction = 'Delete';
            const workflowType: WorkflowInstanceType = 'AttributeValue';
            const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType);
            if (ws && ws.length > 0) {
                for (const w of ws) {
                    const items = await getItemsByIds(viewId, itemIds, false, {limit: Number.MAX_VALUE, offset: 0});
                    if (items.length) {
                       const workflowTriggerResult = await triggerItemWorkflow(items, w.workflowDefinition.id, workflowAction);
                       payload.push(...workflowTriggerResult);
                       itemWorkflowTriggered = true;
                    }
                }
            }
            const messages: { status: ResponseStatus, message: string }[] = [];
            if (itemWorkflowTriggered) {
                const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                    messages,
                    payload
                };
                res.status(200).json(apiResponse);
                return;
            }
        }


        // HANDLE NON_WORKFLOW:
        const errors: string[] = await updateItemsStatus(itemIds, status as Status);
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
                    message: `Items ${status.toLowerCase()}`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];

const f = async (conn: Connection, itemId: number, status: string) => {
    if (itemId) {
        const q: QueryA = await conn.query(`SELECT ID FROM TBL_ITEM WHERE PARENT_ID=?`, [itemId]);
        for (const i of q) {
            const itemId: number = i.ID;
            await f(conn, itemId, status);
        }
        await conn.query(`UPDATE TBL_ITEM SET STATUS = ? WHERE ID=?`, [status, itemId]);
    }
}

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
