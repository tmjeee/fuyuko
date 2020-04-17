import {doInDbConnection, QueryA} from "../db";
import {Connection} from "mariadb";
import {DataMap} from "../model/dashboard-serialzable.model";


export const getUserDashboardWidgetSerializedData = async (userId: number, dashboardWidgetInstanceId: string): Promise<DataMap> => {
    const r: string = await doInDbConnection(async (conn: Connection) => {
        const q1: QueryA = await conn.query(`SELECT ID FROM TBL_USER_DASHBOARD WHERE USER_ID=?`, [userId]);
        if (q1.length <= 0) { // no dashboard for user exists !!
            return null;
        }
        const dashboardId: number = q1[0].ID;

        const q2: QueryA = await conn.query(`SELECT ID, USER_DASHBOARD_ID, WIDGET_INSTANCE_ID, WIDGET_TYPE_ID, SERIALIZED_DATA, CREATION_DATE, LAST_UPDATE  
                FROM TBL_USER_DASHBOARD_WIDGET WHERE USER_DASHBOARD_ID=? AND WIDGET_INSTANCE_ID=?`, [dashboardId, dashboardWidgetInstanceId]);
        if (q2.length <= 0) { // no such dashboard widget data saved for user
            return null;
        }

        const widgetData: string = q2[0].SERIALIZED_DATA;
        return widgetData;
    });

    const d: DataMap = r ? JSON.parse(r) : '';
    return d;
}

export const getUserDashboardSerializedData = async (userId: number): Promise<string> => {
    const f: string = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`SELECT ID, USER_ID, SERIALIZED_DATA FROM TBL_USER_DASHBOARD WHERE USER_ID = ?`, [userId]);

        if (q.length > 0) {
            const data: string = q[0].SERIALIZED_DATA;
            return data;
        } else {
            return null;
        }
    });
    return f;
};