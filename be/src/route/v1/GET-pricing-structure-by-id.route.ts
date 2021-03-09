import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import { param } from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {PricingStructure} from '@fuyuko-common/model/pricing-structure.model';
import {getPricingStructureById} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


// CHECKED

const httpAction: any[] = [
    [
        param('pricingStructureId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const pricingStructure: PricingStructure = await getPricingStructureById(pricingStructureId);
        return res.status(200).json({
            status: 'SUCCESS',
            message: `Pricing structure retrieved`,
            payload: pricingStructure
        } as ApiResponse<PricingStructure>);
    }
];

export const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);

}

export default reg;
