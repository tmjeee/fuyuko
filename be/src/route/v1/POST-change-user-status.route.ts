import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {param} from 'express-validator';
import {ApiResponse} from "../../model/api-response.model";
import {ROLE_ADMIN} from "../../model/role.model";
import {changeUserStatus} from "../../service/user.service";

// CHECKED

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric(),
        param('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const status: string = req.params.status;
        const userId: number = Number(req.params.userId);

        const r: boolean = await changeUserStatus(userId, status);
        if (r) {
            res.status(200).json({
                status: 'SUCCESS',
                message: `User ${userId} status altered to (${status})`
            } as ApiResponse);
        } else {
            res.status(400).json({
                status: 'ERROR',
                message: `User ${userId} status FAILED to be altered to(${status})`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/user/:userId/status/:status';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
