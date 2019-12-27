import {doInDbConnection, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {Level} from '../model/level.model';
import {AuditCategory} from "../route/model/server-side.model";

export type AuditCategory = AuditCategory;
export type AuditLevel = Level;

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
        const q: QueryResponse = await conn.query(`INSERT INTO TBL_AUDIT_LOG (CATEGORY, LEVEL, CREATION_DATE, LOG) VALUES (?,?,?,?)`,
            [category, level, new Date(), message]);
    });
}
