import {doInDbConnection, QueryA, QueryResponse} from '../db';
import {Connection} from 'mariadb';
import {
    DataMap,
    SerializedDashboardFormat,
    SerializedDashboardWidgetInstanceDataFormat
} from '@fuyuko-common/model/dashboard-serialzable.model';
import {
    fireEvent, GetUserDashboardSerializedDataEvent,
    GetUserDashboardWidgetSerializedDataEvent,
    SaveUserDashboardEvent,
    SaveUserDashboardWidgetDataEvent
} from './event/event.service';

class DashboardService {

    /**
     *  ===================================
     *  === SaveUserDashboardWidgetData ===
     *  ===================================
     */
    async saveUserDashboardWidgetData(userId: number, d: SerializedDashboardWidgetInstanceDataFormat): Promise<string[]> {
        const errors: string[] = await doInDbConnection(async (conn: Connection) => {
            const errors: string[] = [];

            const q: QueryA = await conn.query(`SELECT ID FROM TBL_USER_DASHBOARD WHERE USER_ID=?`, [userId]);
            let dashboardId: number | undefined = undefined;
            if (q && q.length <= 0) { // dashboard not already exists
                const q2: QueryResponse = await conn.query(`INSERT INTO TBL_USER_DASHBOARD (USER_ID, SERIALIZED_DATA) VALUES (?, NULL)`, [userId]);
                if (q2.affectedRows <= 0) {
                    errors.push(`Failed to insert dashboard data`);
                    return errors;
                }
                dashboardId = q2.insertId;
            } else {
                dashboardId = q[0].ID;
            }
            const serializedData: string = JSON.stringify(d.data);
            const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_USER_DASHBOARD_WIDGET WHERE USER_DASHBOARD_ID = ? AND WIDGET_INSTANCE_ID =? AND WIDGET_TYPE_ID=?`,
                [dashboardId, d.instanceId, d.typeId]);
            const total = qq[0].COUNT;
            if (total === 0) { // do not exists yet, do insert
                const q3: QueryResponse = await conn.query(`INSERT INTO TBL_USER_DASHBOARD_WIDGET (USER_DASHBOARD_ID, WIDGET_INSTANCE_ID, WIDGET_TYPE_ID, SERIALIZED_DATA) VALUES(?,?,?,?)`,
                    [dashboardId, d.instanceId, d.typeId, serializedData]);
                if (q3.affectedRows <= 0) {
                    errors.push(`Failed to insert dashboard widget data`)
                }
            } else { // already exists, do update
                const r: QueryResponse = await conn.query(`UPDATE TBL_USER_DASHBOARD_WIDGET SET SERIALIZED_DATA = ? WHERE USER_DASHBOARD_ID=? AND WIDGET_INSTANCE_ID=? AND WIDGET_TYPE_ID=?`,
                    [serializedData, dashboardId, d.instanceId, d.typeId]);
                if (r.affectedRows <= 0) {
                    errors.push(`Failed to update dashboard widget data`);
                }
            }
            return errors;
        });

        fireEvent({
            type: 'SaveUserDashboardWidgetDataEvent',
            data: d,
            errors
        } as SaveUserDashboardWidgetDataEvent);

        return errors;
    };

    /**
     *  ===================================
     *  === SaveUserDashboard ===
     *  ===================================
     */
    async saveUserDashboard(userId: number, serializeFormat: SerializedDashboardFormat)  {
        const errors: string[] = [];
        const serializeFormatInString: string = JSON.stringify(serializeFormat);
        await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query('SELECT COUNT(*) AS COUNT FROM TBL_USER_DASHBOARD WHERE USER_ID=?', [userId]);
            const c: number = q[0].COUNT;
            if (c > 0) { // update
                const q1: QueryResponse = await conn.query(`UPDATE TBL_USER_DASHBOARD SET USER_ID=?, SERIALIZED_DATA=?`, [userId, serializeFormatInString]);
                if (q1.affectedRows <= 0) {
                    errors.push(`Failed to update dashboard data`);
                }
            } else { // insert
                const q1: QueryResponse = await conn.query(`INSERT INTO TBL_USER_DASHBOARD (USER_ID, SERIALIZED_DATA) VALUES(?,?)`, [userId, serializeFormatInString]);
                if (q1.affectedRows <= 0) {
                    errors.push(`Failed to add dashboard data`);
                }
            }
        });

        fireEvent({
            type: "SaveUserDashboardEvent",
            data: serializeFormat,
            userId,
            errors
        } as SaveUserDashboardEvent);
        return errors;
    }


    /**
     *  ============================================
     *  === GetUserDashboardWidgetSerializedData ===
     *  ============================================
     */
    async getUserDashboardWidgetSerializedData(userId: number, dashboardWidgetInstanceId: string): Promise<DataMap> {
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

        fireEvent({
            type: "GetUserDashboardWidgetSerializedDataEvent",
            userId,
            data: d
        } as GetUserDashboardWidgetSerializedDataEvent);
        return d;
    }


    /**
     *  ======================================
     *  === GetUserDashboardSerializedData ===
     *  ======================================
     */
    async getUserDashboardSerializedData(userId: number): Promise<string> {
        const f: string = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT ID, USER_ID, SERIALIZED_DATA FROM TBL_USER_DASHBOARD WHERE USER_ID = ?`, [userId]);

            if (q.length > 0) {
                const data: string = q[0].SERIALIZED_DATA;
                return data;
            } else {
                return null;
            }
        });

        fireEvent({
            type: 'GetUserDashboardSerializedDataEvent',
            userId,
            data: f
        } as GetUserDashboardSerializedDataEvent);
        return f;
    };

}

const s = new DashboardService()
export const
    saveUserDashboardWidgetData = s.saveUserDashboardWidgetData.bind(s),
    saveUserDashboard = s.saveUserDashboard.bind(s),
    getUserDashboardWidgetSerializedData = s.getUserDashboardWidgetSerializedData.bind(s),
    getUserDashboardSerializedData = s.getUserDashboardSerializedData.bind(s);
