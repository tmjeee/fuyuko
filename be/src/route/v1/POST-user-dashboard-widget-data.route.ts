import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {param, body} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {SerializedDashboardWidgetInstanceDataFormat} from '@fuyuko-common/model/dashboard-serialzable.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {saveUserDashboardWidgetData} from '../../service';


// CHECKED

const httpAction: any[] = [
    param('userId').exists().isNumeric(),
    body('data').exists(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const d: SerializedDashboardWidgetInstanceDataFormat = req.body;

        const errors: string[] = await saveUserDashboardWidgetData(userId, d);
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
                    message: `Dashboard widget data updated`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/dashboard-widget-instance-data`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
