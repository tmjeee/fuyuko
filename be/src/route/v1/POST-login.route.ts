import {Router, Request, Response, NextFunction} from 'express';
import {body} from 'express-validator';
import {validateMiddlewareFn} from './common-middleware';
import {hashedPassword} from '../../service';
import {User} from '@fuyuko-common/model/user.model';
import {Registry} from '../../registry';
import {LoginResponse} from '@fuyuko-common/model/api-response.model';
import {login} from '../../service';

// CHECKED

const httpAction = [
    [
        body('username').isLength({min: 1}),
        body('password').isLength({min: 1})
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const usrname: string = req.body.username;
        const password: string = hashedPassword(req.body.password);

        const r: {errors: string[], user: User, jwtToken: string, theme: string} = await login(usrname, password);
        if (r.errors && r.errors.length) {
            res.status(200).json({
                status: 'ERROR',
                message: r.errors.join(', '),
                payload: {
                    jwtToken: r.jwtToken,
                    user: r.user,
                    theme: r.theme
                }
            } as LoginResponse)
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Successfully logged in`,
                payload: {
                    jwtToken: r.jwtToken,
                    user: r.user,
                    theme: r.theme
                }
            } as LoginResponse)
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/login';
    registry.addItem('POST', p);
    router.post('/login', ...httpAction) ;
}

export default reg;
