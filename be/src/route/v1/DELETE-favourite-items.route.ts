import {Router, Request, Response, NextFunction} from "express";
import {Registry} from "../../registry";
import { param } from "express-validator";
import {
    aFnAllTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAllUserRoles,
    vFnIsSelf
} from "./common-middleware";
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {removeFavouriteItemIds} from "../../service/item.service";
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('userId').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const fn = v([
           vFnHasAllUserRoles([ROLE_EDIT]),
           vFnIsSelf(userId),
        ], aFnAllTrue)
        return fn(req, res, next);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const userId: number = Number(req.params.userId);
        const itemIds: number[] = req.body.itemIds;

        const errors: string[] = await removeFavouriteItemIds(userId, itemIds);

        if (errors && errors.length) { // has errors
            res.status(400).json({
               status: 'ERROR',
               message: errors.join(',')
            } as ApiResponse);
        } else {
            res.status(200).json({
               status: 'SUCCESS',
               message: `Successfully remove favourite items`
            } as ApiResponse)
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/user/:userId/remove-favourite-items`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
};

export default reg;