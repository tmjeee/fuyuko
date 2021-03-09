import {AppNotification, NewNotification} from '@fuyuko-common/model/notification.model';
import {doInDbConnection, QueryA, QueryI, QueryResponse} from '../db';
import {Connection} from 'mariadb';
import {AddUserNotificationEvent, fireEvent, GetUserNotificationsEvent} from './event/event.service';

class AppNotificationService {

    /**
     *  ===========================
     *  === addUserNotification ===
     *  ===========================
     */
    async addUserNotification(userId: number, newNotification: NewNotification): Promise<boolean> {
        const result: boolean = await doInDbConnection(async (conn: Connection) => {
            const q: QueryResponse = await conn.query(`
                INSERT INTO TBL_USER_NOTIFICATION (USER_ID, IS_NEW, STATUS, TITLE, MESSAGE) VALUES (?,?,?,?,?)
            `, [userId, true, newNotification.status, newNotification.title, newNotification.message]);
            return (q.affectedRows > 0);
        });

        fireEvent({
            type: 'AddUserNotificationEvent',
            userId, newNotification,
            result
        } as AddUserNotificationEvent);

        return result;
    }


    /**
     * ============================
     * === getUserNotifications ===
     * ============================
     */
    async getUserNotifications(userId: number): Promise<AppNotification[]> {
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
        fireEvent({
            type: 'GetUserNotificationsEvent',
            userId,
            notifications: n
        } as GetUserNotificationsEvent);
        return n;
    };
}

const s = new AppNotificationService();
export const addUserNotification = s.addUserNotification.bind(s);
export const getUserNotifications =  s.getUserNotifications.bind(s);
