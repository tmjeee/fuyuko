import {Registry} from '../../registry';
import {Router, Request, Response, NextFunction} from 'express';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {param} from 'express-validator';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {
    getAllPricingStructureItemsWithPrice,
    getPricingStructureById, getPricingStructureItem,
    getWorkflowByViewActionAndType,
    triggerPriceWorkflow,
    updatePricingStructureStatus
} from '../../service';
import {Status} from '@fuyuko-common/model/status.model';
import {Workflow, WorkflowTriggerResult} from '@fuyuko-common/model/workflow.model';


// CHECKED

const httpAction: any[] = [
    [
       param('pricingStructureId').exists().isNumeric(),
       param('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const status: Status = req.params.status as Status;

        // HANDLE WORKFLOW
        const pricingStructure = await getPricingStructureById(pricingStructureId);
        const viewId = pricingStructure.viewId;
        if (status === 'DELETED') {
            // todo:
            const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, 'Delete', 'Price');
            const payload: WorkflowTriggerResult[] = [];
            const prices = await getAllPricingStructureItemsWithPrice(pricingStructureId, {limit: Number.MAX_VALUE, offset: 0});
            if (ws && ws.length > 0) {
                for (const w of ws) {
                    const workflowTriggerResults = await triggerPriceWorkflow(viewId, prices, w.workflowDefinition.id, 'Delete');
                    payload.push(...workflowTriggerResults);
                }

                const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                    messages: [{
                        status: 'INFO',
                        message: `Workflow instance has been triggered to update attribute, workflow instance needs to be completed for actual update to take place`,
                    }],
                    payload
                };
                res.status(200).json(apiResponse);
                return;
            }
        }

        // HANDLE NON_WORKFLOW
        const r: boolean = await updatePricingStructureStatus(pricingStructureId, status as Status);
        if (r) {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: "SUCCESS",
                    message: `Pricing Structure status updated`
                }]
            };
            res.status(200).json(apiResponse);
        } else {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: "ERROR",
                    message: `Pricing Structure status FAILED to be updated`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
