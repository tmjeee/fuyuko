import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import { param, body } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT, ROLE_VIEW} from "../../model/role.model";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {AppNotification, NewNotification} from "../../model/notification.model";

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric(),
        body('notification').exists(),
        body('notification.status').exists().isString(),
        body('notification.title').exists().isString(),
        body('notification.message').exists().isString(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const userId: number = Number(req.params.userId);
        const newNotification: NewNotification = req.body.notification;

        await doInDbConnection(async (conn: Connection) => {
            const q: QueryResponse = await conn.query(`
                INSERT INTO TBL_USER_NOTIFICATION (USER_ID, IS_NEW, STATUS, TITLE, MESSAGE) VALUES (?,?,?,?,?)
            `, [userId, true, newNotification.status, newNotification.title, newNotification.message]);

        });

        res.status(200).json(true);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/notification`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
