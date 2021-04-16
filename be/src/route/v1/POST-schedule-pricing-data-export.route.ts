import {param, body} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {Registry} from '../../registry';
import {Router, Request, Response, NextFunction} from 'express';
import {PricedItem} from '@fuyuko-common/model/item.model';
import {exportPriceRunJob} from '../../service';
import {Job} from '@fuyuko-common/model/job.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('pricingStructureId').exists().isNumeric(),
        body('pricedItems').exists().isArray(),
        body('attributes').exists().isArray()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req:Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const pricedItems: PricedItem[] = req.body.pricedItems;
        const attributes: Attribute[] = req.body.attributes;

        const job: Job = await exportPriceRunJob(viewId, pricingStructureId, attributes, pricedItems);
        const apiResponse: ApiResponse<Job> = {
            messages: [{
                status: 'SUCCESS',
                message: `Pricing data export scheduled`,
            }],
            payload: job
        };
        res.status(200).json(apiResponse);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/pricingStructure/:pricingStructureId/prices`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
