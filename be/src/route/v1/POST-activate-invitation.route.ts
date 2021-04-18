import {NextFunction, Router, Request, Response} from 'express';
import {param, body} from 'express-validator';
import {validateMiddlewareFn} from './common-middleware';
import {Activation} from '@fuyuko-common/model/activation.model';
import {Registry} from '../../registry';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {activateInvitation} from '../../service';

// CHECKED

/**
 * Activate invitation received (eg. through email)
 */
const httpAction = [
    [
        param('code').isLength({ min: 1 }),
        body('username').exists({checkFalsy: true, checkNull: true}),
        body('email').exists().isEmail(),
        body('firstName').exists(),
        body('lastName').exists(),
        body('password').exists()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response , next: NextFunction ) => {
        const code = req.params.code;
        const username = req.body.username;
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;

        const r: {registrationId: number, errors: string[]} = await activateInvitation(code, username, email, firstName, lastName, password);

        if (r.errors && r.errors.length) {
            const apiResponse: ApiResponse<any> = {
                messages: [{
                    status: 'ERROR',
                    message: r.errors.join(', '),
                }],
                payload: {
                    email,
                    registrationId: r.registrationId,
                    message: r.errors.join(', '),
                    status: 'ERROR'
                }
            };
            res.status(400).json(apiResponse);
        } else { // if no errors send before
            const apiResponse: ApiResponse<Activation> = {
                messages: [{
                    status: 'SUCCESS',
                    message: `Successfully activated ${username} (${email})`,
                }],
                payload: {
                    email,
                    registrationId: r.registrationId,
                    message: `Successfully activated ${username} (${email})`,
                    status: 'SUCCESS',
                    username
                }
            };
            res.status(200).json(apiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/activate-invitation/:code';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
