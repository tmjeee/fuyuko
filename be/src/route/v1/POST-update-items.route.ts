import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {body, param} from 'express-validator';
import {Item, Value} from '@fuyuko-common/model/item.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {
    addOrUpdateItem,
    getWorkflowByViewActionAndType, triggerAttributeValueWorkflow,
    triggerAttributeWorkflow,
    triggerItemWorkflow
} from '../../service';
import {
    Workflow,
    WorkflowInstanceAction,
    WorkflowInstanceType,
    WorkflowTriggerResult
} from '@fuyuko-common/model/workflow.model';
import {ResponseStatus} from '@fuyuko-common/model/api-response-status.model';

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('items').isArray(),
        body('items.*.name').exists(),
        body('items.*.description').exists(),
        // body('items.*.parentId').exists()
        // todo: need to check [0].attributeId etc.
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const items: Item[] = req.body.items;
        const effectiveItems: Item[] = items.map( i => ({
            ...i,
        }));
        const messages: { status: ResponseStatus, message: string}[] = [];

        // HANDLE WORKFLOW:
        const payload: WorkflowTriggerResult[] = [];
        let itemWorkflowTriggered = false;
        let attributeValueWorkflowTriggered = true;
            //   ==== Item
        const workflowType2: WorkflowInstanceType = 'Item';
        const workflowAction: WorkflowInstanceAction = 'Update';
        const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType2);
        if (ws && ws.length > 0) {
            for (const w of ws) {
                if (w.type === 'Item') {  // handle Item
                    const workflowTriggerResult = await triggerItemWorkflow(items, w.workflowDefinition.id, 'Update');
                    payload.push(...workflowTriggerResult);
                    itemWorkflowTriggered = true;
                }
            }
        }
        if (itemWorkflowTriggered) { // workflow(s) being triggered
            const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                messages: [{
                    status: 'INFO',
                    message: 'Workflow instance has been triggered to create attribute, workflow instance needs to be completed for actual creation to take place',
                }],
                payload,
            };
            res.status(200).json(apiResponse);
            return;
        } else { // if no item workflow, see if there is a attributeValue worklfow
            const itemAttributeValuesForUpdate: { viewId: number, item: Item, attributeId: number, value: Value }[] = [];         // attributeValue triggered workflow
            const workflowTypeForAttributeValue: WorkflowInstanceType = 'AttributeValue';
            // for (const item of items) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const workflowAction: WorkflowInstanceAction = 'Update';
                const workflowType: WorkflowInstanceType = 'AttributeValue';
                const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType);
                if (ws && ws.length > 0) {
                    for (const w of ws) {
                        if (w.type === 'AttributeValue') { // handle attribute values
                            const attributeIds = w.attributeIds;
                            for (const attributeId of attributeIds) {
                                const value = item[attributeId];
                                if (value) {
                                    itemAttributeValuesForUpdate.push({ viewId, item, attributeId, value});
                                    delete effectiveItems[i][attributeId];
                                }
                            }
                            if (itemAttributeValuesForUpdate.length) {
                                const workflowTriggerResult = await triggerAttributeValueWorkflow(itemAttributeValuesForUpdate, w.workflowDefinition.id, workflowAction);
                                payload.push(...workflowTriggerResult);
                                attributeValueWorkflowTriggered = true;
                            }
                        }
                    }
                }
            }
            if (attributeValueWorkflowTriggered) {
                messages.push({
                    status: 'INFO',
                    message: 'Workflow instance has been triggered to create attribute, workflow instance needs to be completed for actual creation to take place',
                })
            }
        }



        // HANDLE NON_WORKFLOW:
        const errors: string[] = [];
        for (const item of effectiveItems) {
            const err: string[] = await addOrUpdateItem(viewId, item);
            errors.push(...err);
        }

        if (errors && errors.length) {
            messages.push({
                status: 'ERROR',
                message: errors.join(', ')
            });
            const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                messages,
                payload
            };
            res.status(400).json(apiResponse);
        } else {
            messages.push({
                status: 'SUCCESS',
                message: `item(s) updated`
            });
            const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                messages,
                payload
            };
            res.status(200).json(apiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items/update`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
