import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {body, param} from "express-validator";
import {NextFunction, Router, Request, Response} from "express";
import {updateCategory} from "../../service/category.service";
import {ApiResponse} from "../../model/api-response.model";


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('id').exists().isNumeric(),
        body('name').exists(),
        body('description').exists(),
        body('parentId').optional().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const id: number = Number(req.body.id);
        const name: string = req.body.name;
        const description: string = req.body.description;
        const parentId: number = req.body.parentId ? Number(req.body.parentId) : null;

        const errors: string[] = await updateCategory(viewId,  parentId, {
            id,
            name,
            description,
        });

        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `category ${name} updated`
            });
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/update-category`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}


export default reg;
