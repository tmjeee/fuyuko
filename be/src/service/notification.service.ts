import {AppNotification} from "../model/notification.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";


export const getUserNotifications = async (userId: number): Promise<AppNotification[]> => {
    const n: AppNotification[] = await doInDbConnection(async (conn: Connection) => {
        return (await conn.query(`
                SELECT 
                  ID,
                  USER_ID,
                  IS_NEW,
                  STATUS,
                  TITLE,
                  MESSAGE,
                  CREATION_DATE,
                  LAST_UPDATE
                FROM TBL_USER_NOTIFICATION WHERE USER_ID=?
            `, [userId]) as QueryA).reduce((a: AppNotification[], i: QueryI) => {
            const n: AppNotification = {
                id: i.ID,
                isNew: i.IS_NEW,
                status: i.STATUS,
                title: i.TITLE,
                message: i.MESSAGE,
            };
            a.push(n);
            return a;
        }, []);
    });
    return n;
};