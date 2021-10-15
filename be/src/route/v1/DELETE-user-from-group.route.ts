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
import {toHttpStatus} from "./aid.";

export const invocation = async (userId: number, groupId: number): Promise<ApiResponse> => {
    const errors: string[] = await deleteUserFromGroup(userId, groupId);
    if (errors && errors.length) {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'ERROR',
                message: `User ${userId} failed to be deleted from group ${groupId}`
            }]
        };
        return apiResponse;
    } else {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'SUCCESS',
                message: `User ${userId} deleted from group ${groupId}`
            }]
        };
        return apiResponse;
    }
}

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

        const apiResponse = await invocation(userId, groupId);
        res.status(toHttpStatus(apiResponse)).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/group/:groupId/remove-user/:userId';
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
