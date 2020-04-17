import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {PricingStructure} from "../../model/pricing-structure.model";
import {ROLE_VIEW} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";
import {getAllPricingStructures} from "../../service/pricing-struture.service";

// CHECKED
const httpAction: any[] = [
    [
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const pricingStructures: PricingStructure[] = await getAllPricingStructures();

        res.status(200).json( {
            status: 'SUCCESS',
            message: `Pricing structures received successfully`,
            payload: pricingStructures
        } as ApiResponse<PricingStructure[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructures`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
