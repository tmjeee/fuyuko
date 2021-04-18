import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {body} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {View} from '@fuyuko-common/model/view.model';
import {e} from '../../logger';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {addOrUpdateViews} from '../../service';


// CHECKED

const httpAction: any[] = [
    [
         body().isArray(),
         body('*.name').exists(),
         body('*.description').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const views: View[] = req.body;

        const badUpdates: string[] = await addOrUpdateViews(views);

        if (badUpdates.length > 0) {
            e(`bad updates`, ...badUpdates);
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'ERROR',
                    message: badUpdates.join(', ')
                }]
            };
            res.status(200).json(apiResponse);
            return;
        }

        const apiResponse: ApiResponse = {
            messages: [{
                status: 'SUCCESS',
                message: `View(s) updated`
            }]
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p =`/views/update`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
