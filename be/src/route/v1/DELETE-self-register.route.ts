import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue, v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check} from 'express-validator';
import {ROLE_ADMIN} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {deleteSelfRegistration} from "../../service/self-registration.service";

// CHECKED
const httpAction: any[] = [
    [
       check('selfRegistrationId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const selfRegistrationId: number = Number(req.params.selfRegistrationId);

        const boolean = await deleteSelfRegistration(selfRegistrationId);

        if (boolean) {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Self registration ${selfRegistrationId} deleted`
            } as ApiResponse);
        } else {
            res.status(400).json({
                status: 'ERROR',
                messasge: `Failed to delete self registration with id ${selfRegistrationId}`
            })
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/self-register/:selfRegistrationId';
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
