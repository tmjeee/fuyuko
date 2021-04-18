import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import { validateJwtMiddlewareFn, validateMiddlewareFn, v, aFnAnyTrue, vFnHasAnyUserRoles } from "./common-middleware";
import {check} from "express-validator";
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_ADMIN} from '@fuyuko-common/model/role.model';
import {removeRoleFromGroup} from "../../service/role.service";

// CHECKED
const httpAction: any[] = [
    [
        check('groupId').exists().isNumeric(),
        check('roleName').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const groupId: number = Number(req.params.groupId);
        const roleName: string = req.params.roleName;

        const errors: string[] = await removeRoleFromGroup(roleName, groupId);

        if (errors && errors.length) {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'ERROR',
                    message: errors.join(', ')
                }]
            };
            res.status(400).json(apiResponse);
        } else {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'SUCCESS',
                    message: `Role ${roleName} deleted from group ${groupId}`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/group/:groupId/role/:roleName`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
