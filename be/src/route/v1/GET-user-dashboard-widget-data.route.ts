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
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {DataMap} from "../../model/dashboard-serialzable.model";
import {ROLE_VIEW} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";

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

        const r: string = await doInDbConnection(async (conn: Connection) => {
            const q1: QueryA = await conn.query(`SELECT ID FROM TBL_USER_DASHBOARD WHERE USER_ID=?`, [userId]);
            if (q1.length <= 0) { // no dashboard for user exists !!
                return null;
            }
            const dashboardId: number = q1[0].ID;

            const q2: QueryA = await conn.query(`SELECT ID, USER_DASHBOARD_ID, WIDGET_INSTANCE_ID, WIDGET_TYPE_ID, SERIALIZED_DATA, CREATION_DATE, LAST_UPDATE  
                FROM TBL_USER_DASHBOARD_WIDGET WHERE USER_DASHBOARD_ID=? AND WIDGET_INSTANCE_ID=?`, [dashboardId, widgetInstanceId]);
            if (q2.length <= 0) { // no such dashboard widget data saved for user
                return null;
            }

            const widgetData: string = q2[0].SERIALIZED_DATA;
            return widgetData;
        });

        const d: DataMap = r ? JSON.parse(r) : '';
        res.status(200).json({
            status: 'SUCCESS',
            message: `Widget instance data retrieved`,
            payload: d
        } as ApiResponse<DataMap>);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/dashboard-widget-instance/:dashboardWidgetInstanceId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
