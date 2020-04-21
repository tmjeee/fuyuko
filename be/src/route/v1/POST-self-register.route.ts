
import {Request, Response, NextFunction, Router} from 'express';
import {body} from 'express-validator';

import {validateMiddlewareFn} from "./common-middleware";

import {Registry} from "../../registry";
import {RegistrationResponse} from "../../model/api-response.model";
import {selfRegister} from "../../service/self-registration.service";

const httpAction = [
    [
        body('username').exists().isLength({min:1}),
        body('email').exists().isLength({min:1}).isEmail(),
        body('password').exists().isLength({min:1}),
        body('firstName').exists().isLength({min:1}),
        body('lastName').exists().isLength({min:1})
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const username: string = req.body.username
        const email: string = req.body.email;
        const firstName: string = req.body.firstName;
        const lastName: string = req.body.lastName;
        const password: string = req.body.password;

        const r: {errors: string[], registrationId: number, email: string, username: string} = await selfRegister(username, email, firstName, lastName, password);
        if (r.errors && r.errors.length) {
            res.status(200).json({
                status: 'ERROR',
                message: r.errors.join(', '),
                payload: {
                    registrationId: r.registrationId,
                    email: r.email,
                    username: r.username,
                }
            } as RegistrationResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `User ${username} (${email}) registered`,
                payload: {
                    registrationId: r.registrationId,
                    email: r.email,
                    username: r.username,
                }
            } as RegistrationResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/self-register';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
