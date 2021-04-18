import {Registry} from '../../registry';
import {Router, Request, Response, NextFunction} from 'express';
import { param } from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {AppNotification} from '@fuyuko-common/model/notification.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getUserNotifications} from '../../service';


const httpAction: any[] = [
    [
        param('userId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const n: AppNotification[] = await getUserNotifications(userId);
        const apiResponse: ApiResponse<AppNotification[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `App notifications retrieved`,
            }],
            payload: n
        };
        res.status(200).json({
        } as ApiResponse<AppNotification[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/notifications`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
