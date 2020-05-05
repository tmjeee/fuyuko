import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {param} from "express-validator";
import {Category, CategoryWithItems} from "../../model/category.model";
import {getViewCategories, getViewCategoriesWithItems} from "../../service/category.service";
import {ApiResponse} from "../../model/api-response.model";


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);

        const categories: CategoryWithItems[] = await getViewCategoriesWithItems(viewId);

        return res.status(200).json({
            status: 'SUCCESS',
            message: 'success',
            payload: categories
        } as ApiResponse<Category[]>);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/categories-with-items`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}


export default reg;
