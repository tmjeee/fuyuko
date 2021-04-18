import {Level} from "./level.model";

export type AuditCategory = "SYSTEM" | "APP" | "USER" | "HTTP";
export const AUDIT_CATEGORIES: AuditCategory[] = ['SYSTEM' , 'APP' , 'USER' , 'HTTP'];

export interface AuditLog {
    id: number,
    category: AuditCategory,
    level: Level,
    creationDate: Date,
    lastUpdate: Date,
    requestUuid: string,
    userId: number,
    userName: string,
    log: string
}