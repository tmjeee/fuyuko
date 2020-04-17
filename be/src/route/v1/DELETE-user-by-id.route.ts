import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {ApiResponse} from "../../model/api-response.model";
import {check} from 'express-validator';
import {ROLE_ADMIN} from "../../model/role.model";
import {deleteUser} from "../../service/user.service";

// CHECKED
const httpAction: any[] = [
    [
        check('userId').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);

        const r: boolean = await deleteUser(userId);
        if (r) {
            res.status(200).json({
                status: 'SUCCESS',
                message: `User ${userId} deleted`
            } as ApiResponse );
        } else {
            res.status(200).json({
                status: 'ERROR',
                message: `Failed to delete user with id ${userId}`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/user/:userId';
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
