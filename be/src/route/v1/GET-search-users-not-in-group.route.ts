import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
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
import {User} from "../../model/user.model";
import {ApiResponse} from "../../model/api-response.model";
import {searchForUserNotInGroup} from "../../service/user.service";

// CHECKED

const httpAction: any[] = [
    [
        param('groupId').exists().isNumeric(),
        param('username')
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const groupId: number = Number(req.params.groupId);
        const username: string = req.params.username;

        const u: User[] = await searchForUserNotInGroup(groupId, username);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Users retrieved`,
            payload: u
        } as ApiResponse<User[]>);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/users/not-in-group/:groupId/:username?`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
