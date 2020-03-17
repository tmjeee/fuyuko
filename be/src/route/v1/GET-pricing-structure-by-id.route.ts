import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import { param } from "express-validator";
import {valid} from "semver";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {PricingStructure} from "../../model/pricing-structure.model";
import {getPricingStructureById} from "../../service/pricing-struture.service";

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
        return res.status(200).json(pricingStructure);
    }
];

export const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);

}

export default reg;
