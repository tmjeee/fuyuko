import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {addItemToViewCateogry} from '../../service';
import { param } from 'express-validator';
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

        const errors: string[] = await addItemToViewCateogry(categoryId, itemId);

        if (errors && errors.length) {
            res.status(400).json({
               status: 'ERROR',
               message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `item id ${itemId} added to category ${categoryId} in view ${viewId}`
            });
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/category/:categoryId/item/:itemId`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}


export default reg;
