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
            res.status(400).json({
                status: 'ERROR',
                message: r.errors.join(', '),
                payload: {
                    email,
                    registrationId: r.registrationId,
                    message: r.errors.join(', '),
                    status: 'ERROR'
                }
            });
        } else { // if no errors send before
            res.status(200).json({
                status: 'SUCCESS',
                message: `Successfully activated ${username} (${email})`,
                payload: {
                    email,
                    registrationId: r.registrationId,
                    message: `Successfully activated ${username} (${email})`,
                    status: 'SUCCESS',
                    username
                }
            } as ApiResponse<Activation>);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/activate-invitation/:code';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
