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


        // HANDLE WORKFLOW:
        const payload: WorkflowTriggerResult[] = [];
        let anyWorkflowsTriggered = false;
        //const itemAttributeValuesForCreate: {item: Item, attributeId: number, value: Value }[] = [];       // attributeValue triggered workflow
        //const itemAttributeValuesForEdit: {item: Item, attributeId: number, value: Value }[] = [];         // attributeValue triggered workflow
        // const workflowTypeForAttributeValue: WorkflowInstanceType = 'AttributeValue';
        // for (const item of items) {
        //     const workflowAction: WorkflowInstanceAction = item.id > 0 ? 'Edit' : 'Create';
        //     const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType);
        //     if (ws && ws.length > 0) {
        //         for (const w of ws) {
        //             if (w.type === 'AttributeValue') { // handle attribute values
        //                 const attributeIds = w.attributeIds;
        //                 for (const attributeId of attributeIds) {
        //                     const value = item[attributeId];
        //                     if (value) {
        //                         if (workflowAction === 'Edit') {
        //                             itemAttributeValuesForEdit.push({item, attributeId, value})
        //                         } else if (workflowAction === 'Create') {
        //                             itemAttributeValuesForCreate.push({item, attributeId, value})
        //                         }
        //                     }
        //                 }
        //                 if (itemAttributeValuesForCreate.length) {
        //                     const workflowTriggerResult = await triggerAttributeValueWorkflow(itemAttributeValuesForCreate, w.workflowDefinition.id, 'Edit');
        //                     payload.push(...workflowTriggerResult);
        //                     anyWorkflowsTriggered = true;
        //                 } else if (itemAttributeValuesForEdit.length) {
        //                     const workflowTriggerResult = await triggerAttributeValueWorkflow(itemAttributeValuesForEdit, w.workflowDefinition.id, 'Edit');
        //                     payload.push(...workflowTriggerResult);
        //                     anyWorkflowsTriggered = true;
        //                 }
        //             }
        //         }
        //     }
        // }
        const workflowType2: WorkflowInstanceType = 'Item';
        const workflowAction: WorkflowInstanceAction = 'Update';
        const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, workflowAction, workflowType2);
        if (ws && ws.length > 0) {
            for (const w of ws) {
                if (w.type === 'Item') {  // handle Item
                   const workflowTriggerResult = await triggerItemWorkflow(items, w.workflowDefinition.id, 'Update');
                   payload.push(...workflowTriggerResult);
                   anyWorkflowsTriggered = true;
                }
            }
        }
        if (anyWorkflowsTriggered) { // workflow(s) being triggered
            const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                status: 'INFO',
                message: 'Workflow instance has been triggered to create attribute, workflow instance needs to be completed for actual creation to take place',
                payload,
            };
            res.status(200).json(apiResponse);
            return;
        }



        // HANDLE NON_WORKFLOW:
        const errors: string[] = [];
        for (const item of items) {
            const err: string[] = await addOrUpdateItem(viewId, item);
            errors.push(...err);
        }

        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `item(s) updated`
            } as ApiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items/update`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
