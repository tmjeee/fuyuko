import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {body, param} from "express-validator";
import {NextFunction, Router, Request, Response} from "express";
import {updateCategory, updateCategoryHierarchy} from "../../service/category.service";
import {ApiResponse} from "../../model/api-response.model";


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('categoryId').exists().isNumeric(),
        param('parentId').optional()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const categoryId: number = Number(req.params.categoryId);
        const parentId: number = req.params.parentId ? Number(req.params.parentId) : null;

        const errors: string[] = await updateCategoryHierarchy(categoryId,  parentId);

        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `category ${categoryId} hierarchy updated`
            });
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/category/:categoryId/parentId/:parentId/update-hierarchy`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}


export default reg;
