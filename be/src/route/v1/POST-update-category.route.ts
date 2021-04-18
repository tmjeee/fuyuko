import {Registry} from '../../registry';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {body, param} from 'express-validator';
import {NextFunction, Router, Request, Response} from 'express';
import {updateCategory} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('id').exists().isNumeric(),
        body('name').exists(),
        body('description').exists(),
        body('parentId').optional()
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


        // HANDLE WORKFLOW

        const errors: string[] = await updateCategory(viewId,  parentId, {
            id,
            name,
            description,
        });

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
                    message: `category ${name} updated`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/update-category`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}


export default reg;
