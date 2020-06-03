
export type AuditCategory = "SYSTEM" | "APP" | "USER" | "HTTP";

export interface AuditLog {
    id: number,
    category: AuditCategory,
    creationDate: Date,
    lastUpdate: Date,
    requestUuid: string,
    userId: number,
    userName: string,
    log: string
}