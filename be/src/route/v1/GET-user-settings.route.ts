import {param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from './common-middleware';
import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {Settings} from '@fuyuko-common/model/settings.model';
import {getSettings} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

// CHECKED

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const settings: Settings = await getSettings(userId);
        const apiResponse: ApiResponse<Settings> = {
            messages: [{
                status: 'SUCCESS',
                message: `Settings retrieved`,
            }],
            payload: settings
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/settings`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
