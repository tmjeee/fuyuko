import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {DataMap} from '@fuyuko-common/model/dashboard-serialzable.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getUserDashboardWidgetSerializedData} from '../../service';

// CHECKED

const httpAction: any[] = [
    param('userId').exists().isNumeric(),
    param('dashboardWidgetInstanceId').exists(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const userId: number = Number(req.params.userId);
        const widgetInstanceId: string = req.params.dashboardWidgetInstanceId;

        const d: DataMap = await getUserDashboardWidgetSerializedData(userId, widgetInstanceId);
        const apiResponse: ApiResponse<DataMap> = {
            messages: [{
                status: 'SUCCESS',
                message: `Widget instance data retrieved`,
            }],
            payload: d
        };
        res.status(200).json(apiResponse);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/dashboard-widget-instance/:dashboardWidgetInstanceId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
