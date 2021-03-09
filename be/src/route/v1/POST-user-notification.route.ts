import {Registry} from '../../registry';
import {Router, Request, Response, NextFunction} from 'express';
import { param, body } from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {NewNotification} from '@fuyuko-common/model/notification.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {addUserNotification} from '../../service';

// CHECKED

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric(),
        body('notification').exists(),
        body('notification.status').exists().isString(),
        body('notification.title').exists().isString(),
        body('notification.message').exists().isString(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const userId: number = Number(req.params.userId);
        const newNotification: NewNotification = req.body.notification;

        const r: boolean = await addUserNotification(userId, newNotification);

        if (r) {
            res.status(200).json({
                status: 'SUCCESS',
                message: `User notification added`
            } as ApiResponse);
        } else {
            res.status(400).json({
                status: 'ERROR',
                message: `User notification FAILED to be added`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/notification`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
