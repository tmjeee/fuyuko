import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {ROLE_PARTNER} from '@fuyuko-common/model/role.model';
import {PricingStructure} from '@fuyuko-common/model/pricing-structure.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getPartnerPricingStructures} from '../../service';


// CHECKED

const httpAction: any[] = [
    param('userId').exists().isNumeric(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_PARTNER])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const userId: number = Number(req.params.userId);

        const pricingStructures: PricingStructure[] = await getPartnerPricingStructures(userId);
        const apiResponse: ApiResponse<PricingStructure[]> = {
            messages: [{
                status: 'SUCCESS',
                message: 'Pricing structure retrieved',
            }],
            payload: pricingStructures
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/partner-pricing-structures`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
