import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { body } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_ADMIN, ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {deleteGroup} from "../../service/group.service";
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {toHttpStatus} from "./aid.";


export const invocation = async (groupIds: number[]): Promise<ApiResponse> => {
    const errors: string[] = await deleteGroup(groupIds);

    if (errors && errors.length) {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'ERROR',
                message: errors.join(', ')
            }]
        };
        return apiResponse;
    }  else {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'SUCCESS',
                message: `Group(s) successfully deleted`
            }]
        };
        return apiResponse;
    }
}

const httpAction: any[] = [
    [
        body(`groupIds`).isArray(),
        body(`groupIds.*`).isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async(req: Request, res: Response, next: NextFunction) => {
        const groupIds: number[] = req.body.groupIds;

        const apiResponse = await invocation(groupIds);
        res.status(toHttpStatus(apiResponse)).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/groups`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
};

export default reg;
