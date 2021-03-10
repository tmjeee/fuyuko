import {Registry} from '../../registry';
import {Router, Request, Response, NextFunction} from 'express';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {body} from 'express-validator';
import {PricingStructure} from '@fuyuko-common/model/pricing-structure.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {addOrUpdatePricingStructures} from '../../service';

// CHECKED

const httpAction: any[] = [
    [
       body('pricingStructures').isArray(),
       body('pricingStructures.*.name').exists(),
       body('pricingStructures.*.description').exists(),
       body('pricingStructures.*.viewId').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next:NextFunction) => {

        const pricingStructures: PricingStructure[] = req.body.pricingStructures;

        const errors: string[] = await addOrUpdatePricingStructures(pricingStructures);

        if (errors && errors.length) {
            res.status(200).json({
                status: `ERROR`,
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: `SUCCESS`,
                message: `Pricing structure updated`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructures`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
