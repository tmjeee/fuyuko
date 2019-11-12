import {doInDbConnection, QueryResponse} from "../db";
import {PoolConnection} from "mariadb";

export type AuditCategory = "SYSTEM" | "APP" | "USER";
export type AuditLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export const auditLog = async (message: string, category: AuditCategory = "APP", level: AuditLevel = "INFO") => {
    await doInDbConnection(async (conn: PoolConnection) => {
        const q: QueryResponse = await conn.query(`INSERT INTO TBL_AUDIT_LOG (CATEGORY, LEVEL, CREATION_DATE, LOG) VALUES (?,?,?,?)`,
            [category, level, new Date(), message]);
    });
}