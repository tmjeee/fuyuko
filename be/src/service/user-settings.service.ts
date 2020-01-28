import {Settings} from "../model/settings.model";
import {Connection} from "mariadb";
import {doInDbConnection, QueryA} from "../db";
import {create} from "domain";


const DEFAULT_SETTINGS: Settings = new Settings();
DEFAULT_SETTINGS.id = 0;
DEFAULT_SETTINGS.defaultOpenHelpNav = false;
DEFAULT_SETTINGS.defaultOpenSideNav = true;
DEFAULT_SETTINGS.defaultOpenSubSideNav = true;

export const getSettings = async (userId: number, conn: Connection): Promise<Settings> => {
    await createSettingsIfNotExists(userId, conn);
    const s = new Settings();
    const q1: QueryA = await conn.query(`SELECT ID, USER_ID, SETTING, VALUE, TYPE FROM TBL_USER_SETTING WHERE USER_ID=?`, [userId]);
    for (const q of q1) {
        switch (q.TYPE) {
            case 'string':
                // @ts-ignore
                s[q.SETTING] = String(q.VALUE);
                break;
            case 'number':
                // @ts-ignore
                s[q.SETTING] = Number(q.VALUE);
                break;
            case 'boolean':
                // @ts-ignore
                s[q.SETTING] = Boolean(q.VALUE);
                break;
        }
    }
    return s;
}

export const createSettingsIfNotExists = async (userId: number, conn: Connection): Promise<boolean> => {
    const q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_USER_SETTING WHERE USER_ID=?`, [userId]);
    if (q[0].COUNT <= 0) { // there is not yet a settings for this user
        for (let p in DEFAULT_SETTINGS) {
            // @ts-ignore
            const v = DEFAULT_SETTINGS[p];
            if (p !== 'id' && DEFAULT_SETTINGS.hasOwnProperty(p)) {
                conn.query(`
                            INSERT INTO TBL_USER_SETTING ( USER_ID, SETTING, VALUE, TYPE) VALUES (?,?,?,?)
                         `, [userId, p, v, (typeof p)]);
            }
        }
        return true;
    }
    return false;
}
