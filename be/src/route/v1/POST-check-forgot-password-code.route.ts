import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import { param } from 'express-validator';
import {validateMiddlewareFn} from './common-middleware';
import {isValidForgottenPasswordCode} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

const httpAction: any[] = [
    [
        param('code').exists()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const code = req.params.code;

        const r: boolean = await isValidForgottenPasswordCode(code);
        const apiResponse: ApiResponse<boolean> = {
            messages: [{
                status: 'SUCCESS',
                message: 'Validity retrieved',
            }],
            payload: r
        };
        res.status(200).json(apiResponse);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/forgot-password/code/:code/validity`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;