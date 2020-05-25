import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {searchGroupsAssociatedWithPricingStructure} from "../../service/pricing-structure.service";
import { Group } from "../../model/group.model";
import {ApiResponse} from "../../model/api-response.model";

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const groupName: string = req.params.groupName;
        const g: Group[] = await searchGroupsAssociatedWithPricingStructure(pricingStructureId, groupName);

        res.status(200).json({
           status: 'SUCCESS',
           message: `successfully retrieved group`,
           payload: g
        } as ApiResponse<Group[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricing-structure/:pricingStructureId/groups-associated/:groupName?`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;