import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {param, body} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {SerializedDashboardWidgetInstanceDataFormat} from "../../model/dashboard-serialzable.model";
import {ROLE_EDIT} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";
import {saveUserDashboardWidgetData} from "../../service/dashboard.service";


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
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Dashboard widget data updated`
            } as ApiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/dashboard-widget-instance-data`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
