import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import { param } from "express-validator";
import {removeItemFromViewCategory} from "../../service/category.service";
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('categoryId').exists().isNumeric(),
        param('itemId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const categoryId: number = Number(req.params.categoryId);
        const itemId: number = Number(req.params.itemId);

        const errors: string[] = await removeItemFromViewCategory(categoryId, itemId);
        if (errors && errors.length) {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'ERROR',
                    message: errors.join(', ')
                }]
            };
            res.status(400).json(apiResponse);
        } else {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'SUCCESS',
                    message: `Item ${itemId} removed from category ${categoryId} in view ${viewId}`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/category/:categoryId/item/:itemId`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}


export default reg;
