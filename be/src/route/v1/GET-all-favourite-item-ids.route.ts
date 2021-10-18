import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { param } from "express-validator";
import {
    aFnAllTrue,
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles,
    vFnIsSelf
} from "./common-middleware";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getAllFavouriteItemIdsInView} from "../../service/item.service";
import {toHttpStatus} from "./aid.";

export const invocation = async (viewId: number, userId: number): Promise<ApiResponse<number[]>> => {
    const itemIds: number[] = await getAllFavouriteItemIdsInView(viewId, userId);
    const apiResponse: ApiResponse<number[]> = {
        messages: [{
            status: 'SUCCESS',
            message: `Favourite item ids retrieved`,
        }],
        payload: itemIds
    }
    return apiResponse;
}

const httpAction: any[] = [
    [
        param(`viewId`).exists().isNumeric(),
        param(`userId`).exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const fn =  v([
            vFnHasAnyUserRoles([ROLE_VIEW]),
            vFnIsSelf(userId)
        ], aFnAllTrue);
        return fn(req, res, next);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const userId: number = Number(req.params.userId);

        const apiResponse = await invocation(viewId, userId);
        res.status(toHttpStatus(apiResponse)).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/user/:userId/favourite-item-ids`;
    registry.addItem(`GET`, p);
    router.get(p, ...httpAction);
};

export default reg;
