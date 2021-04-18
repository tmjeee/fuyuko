import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {searchGroupsAssociatedWithPricingStructure} from '../../service';
import { Group } from '@fuyuko-common/model/group.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const groupName: string = req.params.groupName;
        const g: Group[] = await searchGroupsAssociatedWithPricingStructure(pricingStructureId, groupName);
        const apiResponse: ApiResponse<Group[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `successfully retrieved group`,
            }],
            payload: g
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricing-structure/:pricingStructureId/groups-associated/:groupName?`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;