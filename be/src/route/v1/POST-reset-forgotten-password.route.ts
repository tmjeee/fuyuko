import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import { param, body } from 'express-validator';
import {validateMiddlewareFn} from './common-middleware';
import {resetForgottenPassword} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


const httpAction: any[] = [
    [
        param('code').exists(),
        body('password').exists()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const code = req.params.code;
        const passwd = req.body.password;
        const errors: string[] = await resetForgottenPassword(code, passwd);
        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: 'Successfully reset password'
            });
        }
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/forgot-password/code/:code/reset`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;