import {Registry} from '../../registry';
import {Router, NextFunction, Request, Response} from 'express';
import { param } from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {PricingStructure} from '@fuyuko-common/model/pricing-structure.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getPricingStructuresByView} from '../../service';

const httpAction: any[] = [
    [
        param(`viewId`).exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const pricingStructures: PricingStructure[] = await getPricingStructuresByView(viewId);
        const apiResponse: ApiResponse<PricingStructure[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Pricing Structures retrieved`,
            }],
            payload: pricingStructures
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/pricingStructures`;
    router.get(p, ...httpAction);
    registry.addItem('GET', p);
};

export default reg;