import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check, param} from 'express-validator';
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {Group} from "../../model/group.model";
import {Role, ROLE_VIEW} from "../../model/role.model";
import {PaginableApiResponse} from "../../model/api-response.model";
import {searchForGroupsWithNoSuchRole, searchForGroupsWithNoSuchRoleCount} from "../../service/group.service";

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
        res.status(200).json({
            total: totalGroups,
            limit: totalGroups,
            offset: 0,
            payload: groups
        } as PaginableApiResponse<Group[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/groups/no-role/:roleName/:groupName?`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);

};

export default reg;
