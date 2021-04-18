import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {toLimitOffset} from "../../util/utils";
import {
    categorySimpleItemsNotInCategory,
    categorySimpleItemsNotInCategoryCount
} from '../../service';
import {CategorySimpleItem} from '@fuyuko-common/model/category.model';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('categoryId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const limitOffset: LimitOffset = toLimitOffset(req);

        const viewId: number =  Number(req.params.viewId);
        const categoryId: number = Number(req.params.categoryId);
        const total: number = await categorySimpleItemsNotInCategoryCount(viewId, categoryId);
        const items: CategorySimpleItem[] = await categorySimpleItemsNotInCategory(viewId, categoryId, limitOffset);
        const apiResponse: PaginableApiResponse<CategorySimpleItem[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Items retrieved successfully`,
            }],
            payload: items,
            limit: limitOffset ? limitOffset.limit : total,
            offset: limitOffset ? limitOffset.offset : 0,
            total: total
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/category/:categoryId/category-simple-items-not-in-category`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;