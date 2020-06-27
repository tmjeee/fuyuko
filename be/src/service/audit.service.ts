import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {Level} from '../model/level.model';
import {getThreadLocalStore, ThreadLocalStore} from "./thread-local.service";
import {AuditCategory, AuditLog} from "../model/audit-log.model";
import {LimitOffset} from "../model/limit-offset.model";
import {LIMIT_OFFSET} from "../util/utils";
import JSZip from 'jszip'

export interface HttpEntryAuditEventType {}
export interface Aaa {}

interface AuditEventType {
   "httpEntry": HttpEntryAuditEventType;
   "aaa": Aaa;
}

export interface AuditEvent<T extends keyof AuditEventType> {
    type: T;
    event: AuditEventType[T]
}

const s = {
   type: 'httpEntry',
   event: {
   } as Aaa
} as AuditEvent<'httpEntry'>;



/////////////////////////////////////////////////////////

export const auditLogDebug = async (message: string, category: AuditCategory = "APP") => {
    auditLog(message, category, 'DEBUG');
}
export const auditLogInfo = async (message: string, category: AuditCategory = "APP") => {
    auditLog(message, category, 'INFO');
}
export const auditLogWarn = async (message: string, category: AuditCategory = "APP") => {
    auditLog(message, category, 'WARN');
}
export const auditLogError = async (message: string, category: AuditCategory = "APP") => {
    auditLog(message, category, 'ERROR');
}
export const auditLog = async (message: string, category: AuditCategory = "APP", level: AuditLevel = "INFO") => {
    await doInDbConnection(async (conn: Connection) => {
        const threadLocalStore: ThreadLocalStore = getThreadLocalStore();
        const reqUuid = threadLocalStore ? threadLocalStore.reqUuid : null;
        const userId = threadLocalStore ? threadLocalStore.jwtPayload ? threadLocalStore.jwtPayload.user ? threadLocalStore.jwtPayload.user.id : null : null : null;
        const q: QueryResponse = await conn.query(`INSERT INTO TBL_AUDIT_LOG (CATEGORY, LEVEL, REQUEST_UUID, USER_ID, LOG) VALUES (?,?,?,?,?)`,
            [category, level, reqUuid, userId, message]);
    });
}

export type AuditLevel = Level;
export type AuditCategory = AuditCategory;


export const getAuditLogsCount = async (filterByUserId: number = null, filterByCategory: AuditCategory = null,
                                        filterByLevel: Level = null, filterByLogs: string = null): Promise<number> => {
    const sqlParams: any[] = [];

    const sqlFilterByUserId = filterByUserId ? filterByUserId == -1 ? ` AND USER_ID IS NULL` : ` AND USER_ID=? ` : ``;
    if (filterByUserId && filterByUserId != -1) { sqlParams.push(filterByUserId)};

    const sqlFilterByCategory = filterByCategory ? ` AND CATEGORY=? `: ``;
    if (filterByCategory) { sqlParams.push(filterByCategory)}

    const sqlFilterByLevel = filterByLevel ? ` AND LEVEL=? `: ``;
    if (filterByLevel) { sqlParams.push(filterByLevel)}

    const sqlFilterByLogs = filterByLogs ? ` AND LOG LIKE ? ` : ``;
    if (filterByLogs) { sqlParams.push(`%${filterByLogs}%`)}

    const sql = `
            SELECT
                COUNT(*) AS COUNT
            FROM TBL_AUDIT_LOG
            WHERE ID IS NOT NULL
            ${sqlFilterByUserId}
            ${sqlFilterByCategory}
            ${sqlFilterByLevel}
            ${sqlFilterByLogs}
    `;

    const q: QueryA =  await doInDbConnection(async (conn: Connection) => {
        return await conn.query(sql, sqlParams);
    });
    return q[0].COUNT;
};

export const getAuditLogs = async (filterByUserId: number = null, filterByCategory: AuditCategory = null,
                                   filterByLevel: Level = null, filterByLogs: string = null, limitOffset: LimitOffset): Promise<AuditLog[]> => {
    const sqlParams: any[] = [];

    const sqlFilterByUserId = filterByUserId ? filterByUserId == -1 ? ` AND AL.USER_ID IS NULL` : ` AND U.ID=? ` : ``;
    if (filterByUserId && filterByUserId != -1) { sqlParams.push(filterByUserId)};

    const sqlFilterByCategory = filterByCategory ? ` AND AL.CATEGORY=? `: ``;
    if (filterByCategory) { sqlParams.push(filterByCategory)}

    const sqlFilterByLevel = filterByLevel ? ` AND AL.LEVEL=? `: ``;
    if (filterByLevel) { sqlParams.push(filterByLevel)}

    const sqlFilterByLogs = filterByLogs ? ` AND AL.LOG LIKE ? ` : ``;
    if (filterByLogs) { sqlParams.push(`%${filterByLogs}%`)}

    const sql = `
            SELECT
                AL.ID AS AL_ID, 
                AL.CATEGORY AS AL_CATEGORY, 
                AL.LEVEL AS AL_LEVEL, 
                AL.CREATION_DATE AS AL_CREATION_DATE, 
                AL.LAST_UPDATE AS AL_LAST_UPDATE, 
                AL.REQUEST_UUID AS AL_REQUEST_UUID, 
                AL.USER_ID AS U_USER_ID, 
                AL.LOG AS AL_LOG,
                U.ID AS U_USER_ID,
                U.USERNAME AS U_USERNAME
            FROM TBL_AUDIT_LOG AS AL
            LEFT JOIN TBL_USER AS U ON U.ID = AL.USER_ID
            WHERE AL.ID IS NOT NULL
            ${sqlFilterByUserId}
            ${sqlFilterByCategory}
            ${sqlFilterByLevel}
            ${sqlFilterByLogs}
            ORDER BY AL.CREATION_DATE DESC
            ${LIMIT_OFFSET(limitOffset)}
    `;
    const q: QueryA = await doInDbConnection(async (conn: Connection) => {
        return await conn.query(sql, sqlParams);
    });
    return q.reduce((acc: AuditLog[], i: QueryI) => {
        acc.push({
           id: i.AL_ID,
           category: i.AL_CATEGORY,
           level: i.AL_LEVEL,
           creationDate: i.AL_CREATION_DATE,
           lastUpdate: i.AL_LAST_UPDATE,
           requestUuid: i.AL_REQUEST_UUID,
           userId: i.U_USER_ID,
           userName: i.U_USERNAME,
           log: i.AL_LOG
        } as AuditLog);
        return acc;
    }, []);
};