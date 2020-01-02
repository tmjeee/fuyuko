import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {param, body} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {SerializedDashboardWidgetInstanceDataFormat} from "../../model/dashboard-serialzable.model";
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import { Connection } from "mariadb";

const httpAction: any[] = [
    param('userId').exists().isNumeric(),
    body('data').exists(),
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const d: SerializedDashboardWidgetInstanceDataFormat = req.body.data;

        await doInDbConnection(async (conn: Connection) => {

            const q: QueryA = await conn.query(`SELECT ID FROM TBL_USER_DASHBOARD WHERE USER_ID=?`, [userId]);
            let dashboardId: number = null;
            if (q && q.length <= 0) { // dashboard not already exists
                const q2: QueryResponse = await conn.query(`INSERT INTO TBL_USER_DASHBOARD (USER_ID, SERIALIZED_DATA) VALUES (?, NULL)`, [userId]);
                dashboardId = q2.insertId;
            } else {
                dashboardId = q[0].ID;
            }
            const serializedData: string = JSON.stringify(d.data);
            await conn.query(`INSERT INTO TBL_USER_DASHBOARD_WIDGET (USER_DASHBOARD_ID, WIDGET_INSTANCE_ID, WIDGET_TYPE_ID, SERIALIZED_DATA VALUES(?,?,?,?)`,
                [dashboardId, d.instanceId, d.typeId, serializedData]);
        });
        res.status(200).json(true);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/dashboard-widget-instance-data`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;