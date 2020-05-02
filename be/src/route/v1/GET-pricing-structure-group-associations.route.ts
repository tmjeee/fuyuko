import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {getPricingStructureGroupAssociations} from "../../service/pricing-structure.service";
import {PricingStructureGroupAssociation} from "../../model/pricing-structure.model";
import {ApiResponse} from "../../model/api-response.model";


const httpAction: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureGroupAssociations: PricingStructureGroupAssociation[] = await getPricingStructureGroupAssociations();
        res.status(200).json({
           status: 'SUCCESS',
           message: `Retrieved successfully`,
           payload: pricingStructureGroupAssociations
        } as ApiResponse<PricingStructureGroupAssociation[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricing-structure-group-associations`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};


export default reg;