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
import {Group} from '@fuyuko-common/model/group.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {searchForGroupsWithNoSuchRole, searchForGroupsWithNoSuchRoleCount} from '../../service';

// CHECKED

const httpAction: any[] = [
    [
        param('roleName').exists(),
        param('groupName')
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const roleName: string = req.params.roleName;
        const groupName: string = req.params.groupName;

        const totalGroups: number = await searchForGroupsWithNoSuchRoleCount(roleName, groupName);
        const groups: Group[] = await searchForGroupsWithNoSuchRole(roleName, groupName);
        const apiResponse: PaginableApiResponse<Group[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Groups retrieved successfully`
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
    const p = `/groups/no-role/:roleName/:groupName?`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);

};

export default reg;
