import {Settings} from '@fuyuko-common/model/settings.model';
import {Connection} from 'mariadb';
import {doInDbConnection, QueryA, QueryResponse} from '../db';
import {fireEvent, GetSettingsEvent, UpdateUserSettingsEvent} from './event/event.service';

export const DEFAULT_SETTINGS: Settings = new Settings();
DEFAULT_SETTINGS.id = 0;
DEFAULT_SETTINGS.openHelpNav = false;
DEFAULT_SETTINGS.openSideNav = true;
DEFAULT_SETTINGS.openSubSideNav = true;

export type UpdateUserSettingsInput = _UpdateUserSettingsInput;
export interface _UpdateUserSettingsInput { [key: string]: any }

class UserSettingsService {
    /**
     *  =============================
     *  === updateUserSettings ===
     *  =============================
     */
    async updateUserSettings(userId: number, settings: UpdateUserSettingsInput): Promise<string[]> {
        const errors: string[] = [];
        for (const key in settings) {
            const k = key;
            const v = settings[key];

            // @ts-ignore
            const dv = DEFAULT_SETTINGS[k];
            const tv = (dv !== null && dv !== undefined) ? typeof dv : 'string';

            const q: QueryResponse = await doInDbConnection(async (conn: Connection) => {
                return await conn.query(`INSERT INTO TBL_USER_SETTING (USER_ID, SETTING, VALUE, TYPE) VALUES (?,?,?,?)`,
                    [userId, k, v, tv]);
            });
            if (q.affectedRows <= 0) {
                errors.push(`Failed to update settings ${k} to ${v} of type ${tv}`);
            }
        }
        fireEvent({
            type: "UpdateUserSettingsEvent",
            userId, settings, errors
        } as UpdateUserSettingsEvent);
        return errors;
    }

    /**
     *  =============================
     *  === getSettings ===
     *  =============================
     */
    async getSettings(userId: number): Promise<Settings> {
        const settings: Settings = await doInDbConnection(async (conn: Connection) => {
            await this.createSettingsIfNotExists(userId, conn);
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
                        s[q.SETTING] = Boolean(Number(q.VALUE));
                        break;
                }
            }
            return s;
        });
        fireEvent({
            type: "GetSettingsEvent",
            userId, settings
        } as GetSettingsEvent);
        return settings;
    }
    private async createSettingsIfNotExists(userId: number, conn: Connection): Promise<boolean> {
        const q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_USER_SETTING WHERE USER_ID=?`, [userId]);
        if (q[0].COUNT <= 0) { // there is not yet a settings for this user
            for (let p in DEFAULT_SETTINGS) {
                // @ts-ignore
                const v = DEFAULT_SETTINGS[p];
                if (p !== 'id' && DEFAULT_SETTINGS.hasOwnProperty(p)) {
                    conn.query(`
                            INSERT INTO TBL_USER_SETTING ( USER_ID, SETTING, VALUE, TYPE) VALUES (?,?,?,?)
                         `, [userId, p, v, (typeof v)]);
                }
            }
            return true;
        }
        return false;
    }
}

const s = new UserSettingsService();
export const
    updateUserSettings = s.updateUserSettings.bind(s),
    getSettings = s.getSettings.bind(s);