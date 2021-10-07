import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {param} from 'express-validator';
import {
    PricingStructure,
    PricingStructureItemWithPrice,
    PricingStructureWithItems
} from '@fuyuko-common/model/pricing-structure.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {toLimitOffset} from "../../util/utils";
import {
    getAllPricingStructureItemsWithPrice,
    getAllPricingStructureItemsWithPriceCount, getPricingStructureById
} from '../../service';


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
        const limitOffset = toLimitOffset(req);

        const ps: PricingStructure = await getPricingStructureById(pricingStructureId);
        const total: number = await getAllPricingStructureItemsWithPriceCount(pricingStructureId);
        const items: PricingStructureItemWithPrice[] = await getAllPricingStructureItemsWithPrice(pricingStructureId, limitOffset);

        const pricingStructureWithItems: PricingStructureWithItems = {
            id: ps.id,
            name: ps.name,
            viewId: ps.viewId,
            description: ps.description,
            creationDate: ps.creationDate,
            lastUpdate: ps.lastUpdate,
            items:  {
                limit: limitOffset ? limitOffset.limit : total,
                offset: limitOffset ? limitOffset.offset: 0,
                total,
                payload: items
            } as PaginableApiResponse<PricingStructureItemWithPrice[]>
        } as PricingStructureWithItems;

        const apiResponse: ApiResponse<PricingStructureWithItems> = {
            messages: [{
                status: 'SUCCESS',
                message: `Pricing structure with items successfully retrieved`,
            }],
            payload: pricingStructureWithItems
        }
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructuresWithItems/:pricingStructureId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
