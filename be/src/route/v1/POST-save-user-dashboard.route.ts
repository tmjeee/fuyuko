import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response } from "express";
import {param, body} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {SerializedDashboardFormat} from "../../model/dashboard-serialzable.model";
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {ROLE_EDIT} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";
import {saveUserDashboard} from "../../service/dashboard.service";


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
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Dashboard saved`
            } as ApiResponse);
        }

    }
]



const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/dashboard/save`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);

}

export default reg;
