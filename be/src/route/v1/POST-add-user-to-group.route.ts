import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";
import {ApiResponse} from "../../model/response.model";
import {ROLE_ADMIN, ROLE_EDIT} from "../../model/role.model";

const httpAction: any[] = [
    [
        check('groupId').exists().isNumeric(),
        check('userId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const groupId: number = Number(req.params.groupId);
        const userId: number = Number(req.params.userId);

        await doInDbConnection(async (conn: Connection) => {
           const q1: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_LOOKUP_USER_GROUP WHERE GROUP_ID = ? AND USER_ID = ?`, [groupId, userId]);
           if (q1.length > 0 && q1[0].COUNT > 0) {
               res.status(400).json(makeApiErrorObj(
                   makeApiError(`User ${userId} already in group ${groupId}`, 'userId', String(userId), 'System')
               ));
               return;
           }

           await conn.query(`INSERT INTO TBL_LOOKUP_USER_GROUP (GROUP_ID, USER_ID) VALUES (?, ?)`, [groupId, userId]);
           res.status(200).json({
               status: "SUCCESS",
               message: `User ${userId} added to group ${groupId}`
           } as ApiResponse);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/group/:groupId/add-user/:userId';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
