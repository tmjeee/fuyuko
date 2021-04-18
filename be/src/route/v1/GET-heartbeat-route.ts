import {Router, Request, Response, NextFunction} from 'express';
require('express-async-errors');
import {Registry} from '../../registry';
import {validateMiddlewareFn} from './common-middleware';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {heartbeat} from '../../service';

// CHECKED

/**
 * Tells if application is alive and responsive
 */
const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const h: {date: string} = await heartbeat();
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'SUCCESS',
                message: `${h.date}`
            }]
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
   const p = `/heartbeat`;
   registry.addItem('GET', p);
   router.get(p, ...httpAction);
};

export default reg;
