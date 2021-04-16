import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import { body } from 'express-validator';
import {validateMiddlewareFn} from './common-middleware';
import {forgotPassword} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


const httpAction: any = [
    [
        body('username'),
        body('email')
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const errors: string[] = await forgotPassword({
           username: req.body.username,
           email: req.body.email
        });
        if (errors && errors.length) {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'ERROR',
                    message: errors.join(', ')
                }]
            };
            res.status(400).json(apiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: 'Forgot email password sent'
            });
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/forgot-password`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};


export default reg;