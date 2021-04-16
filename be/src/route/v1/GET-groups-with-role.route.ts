import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check} from 'express-validator';
import {Group} from '@fuyuko-common/model/group.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {getGroupsWithRole, getGroupsWithRoleCount} from '../../service';


// CHECKED
const httpAction: any[] = [
    [
        check('roleName').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const roleName: string = req.params.roleName;

        const totalGroups: number = await getGroupsWithRoleCount(roleName);
        const groups: Group[] = await getGroupsWithRole(roleName);

        const apiResponse: PaginableApiResponse<Group[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Groups obtained successfully`
            }],
            total: totalGroups,
            limit: totalGroups,
            offset: 0,
            payload: groups
        };
        res.status(200).json(apiResponse);
    }
];



const reg = (router: Router, registry: Registry) => {
    const p = `/groups/with-role/:roleName`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);

}

export default reg;
