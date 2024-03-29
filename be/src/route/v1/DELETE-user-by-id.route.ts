import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {check} from 'express-validator';
import {ROLE_ADMIN} from '@fuyuko-common/model/role.model';
import {deleteUser} from "../../service/user.service";
import {toHttpStatus} from "./aid.";

export const invocation = async (userId: number): Promise<ApiResponse> => {
    const r: boolean = await deleteUser(userId);
    if (r) {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'SUCCESS',
                message: `User ${userId} deleted`
            }]
        };
        return apiResponse;
    } else {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'ERROR',
                message: `Failed to delete user with id ${userId}`
            }]
        };
        return apiResponse;
    }
}

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

        const apiResponse = await invocation(userId);
        res.status(toHttpStatus(apiResponse)).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/user/:userId';
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
