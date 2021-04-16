import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {addCategory} from '../../service';
import {ApiResponse} from "@fuyuko-common/model/api-response.model";
import {body, param} from 'express-validator';


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('name').exists(),
        body('description').exists(),
        body('parentId').optional().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const name: string = req.body.name;
        const description: string = req.body.description;
        const parentId: number = req.body.parentId ? Number(req.body.parentId) : null;

        const errors: string[] = await addCategory(viewId, parentId, {
            name,
            description,
            children: []
        });

        // HANDLE WORKFLOW

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
                    message: `category ${name} added`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/add-category`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}


export default reg;
