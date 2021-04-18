import {Router, Request, Response, NextFunction} from 'express';
import {check} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {Registry} from '../../registry';
import {ROLE_ADMIN, ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse, RegistrationResponse} from '@fuyuko-common/model/api-response.model';
import {approveSelfRegistration} from '../../service';

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
            const apiResponse: RegistrationResponse = {
                messages: [{
                    message: r.errors.join(', '),
                    status: 'ERROR',
                }],
                payload: {
                    registrationId: selfRegistrationId,
                    email: r.email,
                    username: r.username
                }
            };
            res.status(400).json(apiResponse);
        } else {
            const apiResponse: RegistrationResponse = {
                messages: [{
                    status: 'SUCCESS',
                    message: `Self registration approval for ${r.username} (${r.email}) success`,
                }],
                payload: {
                    registrationId: selfRegistrationId,
                    email: r.email,
                    username: r.username
                }
            };
            res.status(200).json(apiResponse);
        }
    }
]


const reg = (router: Router, registry: Registry) => {
    const p = '/self-register/approve/:selfRegistrationId';
    registry.addItem('POST', p);
    router.post(p, ...httpAction)
}
export default reg;
