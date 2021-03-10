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
import {setPricesB} from '../../service';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';


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
