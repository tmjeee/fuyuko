import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import { param } from "express-validator";
import {searchGroupsNotAssociatedWithPricingStructure} from '../../service';
import {Group} from '@fuyuko-common/model/group.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


const httpAction: any[] = [
    [
        param('pricingStructureId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const groupName: string = req.params.groupName;

        const groups: Group[] = await searchGroupsNotAssociatedWithPricingStructure(pricingStructureId, groupName);

        return res.status(200).json({
            status: 'SUCCESS',
            message: `Groups retrieved`,
            payload: groups
        } as ApiResponse<Group[]>)
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/pricing-structure/:pricingStructureId/groups-not-associated/:groupName?`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};


export default reg;