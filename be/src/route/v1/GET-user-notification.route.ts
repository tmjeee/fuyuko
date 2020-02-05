import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {AppNotification} from "../../model/notification.model";

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const n: AppNotification[] = await doInDbConnection(async (conn: Connection) => {
            (await conn.query(`
                SELECT 
                  ID,
                  USER_ID,
                  IS_NEW,
                  STATUS,
                  TITLE,
                  MESSAGE,
                  CREATION_DATE,
                  LAST_UPDATE
                FROM TBL_USER_NOTIFICATION WHERE USER_ID=?
            `, [userId]) as QueryA).reduce((a: AppNotification[], i: QueryI) => {
                const n: AppNotification = {
                    id: i.ID,
                    isNew: i.IS_NEW,
                    status: i.STATUS,
                    title: i.TITLE,
                    message: i.MESSAGE,
                };
                a.push(n);
                return a;
            }, []);
        });

        res.status(200).json(n);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/notifications`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
