import {Router, Request, Response, NextFunction} from 'express';
import {Registry} from '../../registry';
import { param, body } from 'express-validator';
import {
    aFnAllTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles,
    vFnIsSelf
} from './common-middleware';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {addFavouriteItemIds} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

const httpAction: any[] = [
    [
        param(`userId`).exists().isNumeric(),
        param(`viewId`).exists().isNumeric(),
        body(`itemIds`).exists().isArray(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    (req: Request, res: Response, next: NextFunction) => {
        const userId = Number(req.params.userId);
        const fn = v([
            vFnHasAnyUserRoles([ROLE_EDIT]),
            vFnIsSelf(userId)
        ], aFnAllTrue);
        return fn(req, res, next);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const viewId: number = Number(req.params.viewId);
        const itemIds: number[] = req.body.itemIds;

        const errors: string[] = await addFavouriteItemIds(userId, itemIds);
        if (errors && errors.length) { // has errors
            res.status(400).json({
               status: 'ERROR',
               message: errors.join(',')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Favourite items added`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/user/:userId/add-favourite-items`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;