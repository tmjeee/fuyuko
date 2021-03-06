import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response } from 'express';
import {param, body} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {SerializedDashboardFormat} from '@fuyuko-common/model/dashboard-serialzable.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {saveUserDashboard} from '../../service';


// CHECKED


const httpAction: any[] = [
    [
        param('userId').exists().isNumeric(),
        body('serializeFormat').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const userId: number = Number(req.params.userId);
        const serializeFormat: SerializedDashboardFormat =  req.body.serializeFormat;

        const errors: string[] = await saveUserDashboard(userId, serializeFormat);
        if (errors && errors.length) {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'ERROR',
                    message: errors.join(', ')
                }]
            };
            res.status(400).json(apiResponse);
        } else {
            const apiReponse: ApiResponse = {
                messages: [{
                    status: 'SUCCESS',
                    message: `Dashboard saved`
                }]
            };
            res.status(200).json(apiReponse);
        }
    }
]



const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/dashboard/save`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);

}

export default reg;
