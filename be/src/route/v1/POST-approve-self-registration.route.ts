import {Router, Request, Response, NextFunction} from "express";
import {check} from "express-validator";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";
import {hashedPassword, sendEmail} from "../../service";
import config from '../../config';
import {Registry} from "../../registry";
import {ROLE_ADMIN, ROLE_EDIT} from "../../model/role.model";
import {RegistrationResponse} from "../../model/api-response.model";
import {approveSelfRegistration} from "../../service/self-registration.service";

// CHECKED

/**
 * Approve other users' self registration entries
 */
const httpAction = [
    [
        check('selfRegistrationId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const selfRegistrationId: number = Number(req.params.selfRegistrationId);

        const r: {username: string, email: string, errors: string[]} = await approveSelfRegistration(selfRegistrationId);

        if (r.errors && r.errors.length) {
            res.status(400).json({
                message: r.errors.join(', '),
                status: 'ERROR',
                payload: {
                    registrationId: selfRegistrationId,
                    email: r.email,
                    username: r.username
                }
            } as RegistrationResponse);
        } else {
            res.status(200).json({
                message: `Self registration approval for ${r.username} (${r.email}) success`,
                status: 'SUCCESS',
                payload: {
                    registrationId: selfRegistrationId,
                    email: r.email,
                    username: r.username
                }
            } as RegistrationResponse);
        }
    }
]


const reg = (router: Router, registry: Registry) => {
    const p = '/self-register/approve/:selfRegistrationId';
    registry.addItem('POST', p);
    router.post(p, ...httpAction)
}
export default reg;
