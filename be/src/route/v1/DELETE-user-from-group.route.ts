import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue, ClientError,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check} from 'express-validator';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_ADMIN} from '@fuyuko-common/model/role.model';
import {deleteUserFromGroup} from "../../service/user.service";

// CHECKED
const httpAction: any[] = [
    [
        check('userId').exists().isNumeric(),
        check('groupId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const userId: number = Number(req.params.userId);
        const groupId: number = Number(req.params.groupId);

        const errors: string[] = await deleteUserFromGroup(userId, groupId);
        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: `User ${userId} failed to be deleted from group ${groupId}`
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `User ${userId} deleted from group ${groupId}`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/group/:groupId/remove-user/:userId';
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
