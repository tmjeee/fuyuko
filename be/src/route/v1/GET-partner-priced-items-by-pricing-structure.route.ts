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
import {getPricedItems} from '../../service';
import {PricedItem} from '@fuyuko-common/model/item.model';
import {ROLE_PARTNER} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


// CHECKED


const httpAction: any[] = [
    param('pricingStructureId').exists().isNumeric(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_PARTNER])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const pricedItems: PricedItem[] = await getPricedItems(pricingStructureId);
        const apiResponse: ApiResponse<PricedItem[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Priced Items retrieved`,
            }],
            payload: pricedItems
        };
        res.status(200).json(apiResponse);
    }
]


const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId/pricedItems`
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}


export default reg;
