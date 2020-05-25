import {Registry} from "../../registry";
import {Router, NextFunction, Request, Response} from "express";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {PricingStructure} from "../../model/pricing-structure.model";
import {ApiResponse} from "../../model/api-response.model";
import {getPricingStructuresByView} from "../../service/pricing-structure.service";

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
        res.status(200).json( {
            status: 'SUCCESS',
            message: `Pricing Structures retrieved`,
            payload: pricingStructures
        } as ApiResponse<PricingStructure[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/pricingStructures`;
    router.get(p, ...httpAction);
    registry.addItem('GET', p);
};

export default reg;