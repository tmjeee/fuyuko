import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {ROLE_PARTNER, ROLE_VIEW} from "../../model/role.model";
import {PricingStructure} from "../../model/pricing-structure.model";
import {ApiResponse} from "../../model/api-response.model";
import {getPartnerPricingStructures} from "../../service/pricing-structure.service";


// CHECKED

const httpAction: any[] = [
    param('userId').exists().isNumeric(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_PARTNER])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const userId: number = Number(req.params.userId);

        const pricingStructures: PricingStructure[] = await getPartnerPricingStructures(userId);

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Pricing structure retrieved',
            payload: pricingStructures
        } as ApiResponse<PricingStructure[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/partner-pricing-structures`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
