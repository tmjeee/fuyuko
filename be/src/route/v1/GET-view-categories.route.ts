import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {getViewCategories} from "../../service/category.service";
import {Category} from "../../model/category.model";
import {ApiResponse} from "../../model/api-response.model";
import { param } from "express-validator";


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);

        const categories: Category[] = await getViewCategories(viewId);

        return res.status(200).json({
            status: 'SUCCESS',
            message: 'success',
            payload: categories
        } as ApiResponse<Category[]>);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/categories`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};


export default reg;
