import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {param} from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {Role, ROLE_EDIT, ROLE_VIEW} from "../../model/role.model";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {Group} from "../../model/group.model";
import {ApiResponse} from "../../model/api-response.model";
import {searchForGroupByName} from "../../service/group.service";

// CHECKED

const httpAction: any[] = [
    param('groupName').exists(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const groupName: string = req.params.groupName;
        const groups: Group[] = await searchForGroupByName(groupName);
        res.status(200).json({
            status: 'SUCCESS',
            message: `Groups retrieved`,
            payload: groups
        } as ApiResponse<Group[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/group/:groupName/search`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;