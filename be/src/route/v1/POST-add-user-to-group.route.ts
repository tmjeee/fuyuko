import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {body} from 'express-validator';
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";
import {ApiResponse} from "../../model/api-response.model";
import {ROLE_ADMIN} from "../../model/role.model";
import {addUserToGroup} from "../../service/user.service";

// CHECKED

const httpAction: any[] = [
    [
        body('groupId').exists().isNumeric(),
        body('userId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const groupId: number = Number(req.params.groupId);
        const userId: number = Number(req.params.userId);

        const errors: string[] = await addUserToGroup(userId, groupId);
        if (errors && errors.length) {
            res.status(400).json({
                status: "ERROR",
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: "SUCCESS",
                message: `User ${userId} added to group ${groupId}`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/group/:groupId/add-user/:userId';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
