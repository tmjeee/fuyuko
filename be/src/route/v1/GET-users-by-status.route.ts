import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {Group} from "../../model/group.model";
import {Role, ROLE_VIEW} from "../../model/role.model";
import {User} from "../../model/user.model";
import {check} from 'express-validator';
import {ApiResponse} from "../../model/api-response.model";
import {getUsersByStatus} from "../../service/user.service";
import {Status} from "../../model/status.model";

// CHECKED

const httpAction: any[] = [
    [
        check('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const status: string = req.params.status;
        const u: User[] = await getUsersByStatus(status as Status);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Users retrieved`,
            payload: u
        } as ApiResponse<User[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/users/status/:status';
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
