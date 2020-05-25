import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {AppNotification} from "../../model/notification.model";
import {ApiResponse} from "../../model/api-response.model";
import {getUserNotifications} from "../../service/notification.service";

// CHECKED

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const n: AppNotification[] = await getUserNotifications(userId);

        res.status(200).json({
            status: 'SUCCESS',
            message: `App notifications retrieved`,
            payload: n
        } as ApiResponse<AppNotification[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/notifications`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
