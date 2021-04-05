import {Registry} from '../../registry';
import {Router, Request, Response, NextFunction} from 'express';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {param, body} from 'express-validator';
import {PricingStructureItemWithPrice} from '@fuyuko-common/model/pricing-structure.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {
    getAllPricingStructureItemsWithPrice,
    getPricedItems,
    getPricingStructureById, getPricingStructureItem,
    getWorkflowByViewActionAndType,
    setPricesB,
    triggerItemWorkflow, triggerPriceWorkflow
} from '../../service';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {
    Workflow,
    WorkflowInstanceAction,
    WorkflowInstanceType,
    WorkflowTriggerResult
} from '@fuyuko-common/model/workflow.model';


// CHECKED

const httpAction: any[] = [
    [
        param('pricingStructureId').exists().isNumeric(),
        body('pricingStructureItems').isArray(),
        body('pricingStructureItems.*.id'),
        body('pricingStructureItems.*.itemId').exists().isNumeric(),
        body('pricingStructureItems.*.price').exists().isNumeric(),
        body('pricingStructureItems.*.country').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const pricingStructureItems: PricingStructureItemWithPrice[] =  req.body.pricingStructureItems;

        // HANDLE WORKFLOW
        const pricingStructure = await getPricingStructureById(pricingStructureId);
        const viewId = pricingStructure.viewId;
        const payload: WorkflowTriggerResult[] = [];
        let workfowTriggered = false;
        const ws: Workflow[] = await getWorkflowByViewActionAndType(viewId, 'Update', 'Price');
        if (ws && ws.length > 0) {
            const pricedItems = await getAllPricingStructureItemsWithPrice(pricingStructureId, {limit: Number.MAX_VALUE, offset: 0});
            const workflowTriggerResults = await triggerPriceWorkflow(pricedItems, 'Update');
            payload.push(...workflowTriggerResults);
            workfowTriggered = true;
        }
        if (workfowTriggered) {
            const apiResponse: ApiResponse<WorkflowTriggerResult[]> = {
                status: 'INFO',
                message: `Workflow instance has been triggered to update attribute, workflow instance needs to be completed for actual update to take place`,
                payload
            };
            res.status(200).json(apiResponse);
            return;
        }



        // HANDLE NON_WORKFLOW
        const errors: string[] = await setPricesB(pricingStructureId, pricingStructureItems);

        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            });
        } else {
            res.status(200).json({
                status: "SUCCESS",
                message: `Pricing updated`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId/item`;
    router.post(p, ...httpAction);
}

export default reg;
