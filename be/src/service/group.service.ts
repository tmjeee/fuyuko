import {Group} from "../model/group.model";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {Role} from "../model/role.model";
import {DELETED, ENABLED} from "../model/status.model";
import {
    AddOrUpdateGroupEvent,
    DeleteGroupEvent,
    fireEvent,
    GetAllGroupsEvent,
    GetGroupByIdEvent,
    GetGroupByNameEvent,
    GetGroupsWithRoleEvent,
    SearchForGroupByNameEvent,
    SearchForGroupsWithNoSuchRoleEvent
} from "./event/event.service";

export interface AddOrUpdateGroupInput { id: number, name: string, description: string, isSystem?: boolean};
class GroupService {
    /**
     *  ========================================
     *  === deleteGroup ===
     *  ========================================
     */
    async deleteGroup(groupIds: number[]): Promise<string[]> {
        const errors: string[] = await doInDbConnection(async (conn: Connection) => {
            const errors: string[] = [];
            for (const groupId of groupIds) {
                const q: QueryResponse = await conn.query(`UPDATE TBL_GROUP SET STATUS = ? WHERE ID=?`, [DELETED, groupId]);
                if (q.affectedRows <= 0) {
                    errors.push(`Failed to delete group id ${groupId}`);
                }
            }
            return errors;
        });
        fireEvent({
            type: "DeleteGroupEvent",
            groupIds, errors
        } as DeleteGroupEvent);
        return errors;
    };

    /**
     *  ========================================
     *  === addOrUpdateGroup ===
     *  ========================================
     */
    async addOrUpdateGroup(g: AddOrUpdateGroupInput): Promise<string[]> {
        const errors: string[] = await doInDbConnection(async (conn: Connection) => {
            const errors: string[] = [];
            if (g.id < 0) { // add
                const qc: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_GROUP WHERE NAME=?`, [g.name]);
                if (qc[0].COUNT > 0) {
                    errors.push(`Group with name ${g.name} already exists`);
                } else {
                    const q: QueryResponse = await conn.query(`
                        INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS, IS_SYSTEM) VALUES (?, ?, ?, ?)
                    `, [g.name, g.description, ENABLED, (g.isSystem ? true : false) ]);
                    if (q.affectedRows < 0) {
                        errors.push(`Failed to add group ${g.name}`);
                    }
                }
            } else { // update
                const qc: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_GROUP WHERE ID=?`, [g.id]);
                if (qc[0].COUNT <= 0) {
                    errors.push(`Group with id ${g.id} do not exists`);
                } else {
                    const q: QueryResponse = await conn.query(`
                        UPDATE TBL_GROUP SET NAME=?, DESCRIPTION=?, IS_SYSTEM = ? WHERE ID=?
                    `, [g.name, g.description, (g.isSystem ? true : false), g.id]);
                    if (q.affectedRows < 0) {
                        errors.push(`Failed to update group id ${g.id}`);
                    }
                }
            }
            return errors;
        });
        fireEvent({
            type: "AddOrUpdateGroup",
            input: g,
            errors
        } as AddOrUpdateGroupEvent);
        return errors;
    }

    /**
     *  ========================================
     *  === searchForGroupsWithNoSuchRole ===
     *  ========================================
     */
    async searchForGroupsWithNoSuchRoleCount(roleName: string, groupName?: string): Promise<number> {
        return await doInDbConnection(async (conn: Connection) => {

            const qTotal: QueryA = await conn.query(`
                    SELECT 
                        COUNT(*) AS COUNT
                    FROM TBL_GROUP AS G
                    WHERE G.STATUS = 'ENABLED'
                    AND G.ID NOT IN (
                        SELECT 
                            G.ID
                         FROM TBL_GROUP AS G
                         LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                         LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                         WHERE R.NAME = ? 
                    ) AND G.NAME LIKE ?
                `, [roleName, `%${groupName ? groupName : ''}%`]);
            return qTotal;
        });
    };

    async searchForGroupsWithNoSuchRole(roleName: string, groupName?: string): Promise<Group[]> {
        const groups: Group[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                    SELECT 
                        G.ID AS G_ID,
                        G.NAME AS G_NAME,
                        G.DESCRIPTION AS G_DESCRIPTION,
                        G.STATUS AS G_STATUS,
                        G.IS_SYSTEM AS G_IS_SYSTEM,
                        R.ID AS R_ID,
                        R.NAME AS R_NAME,
                        R.DESCRIPTION AS R_DESCRIPTION
                    FROM TBL_GROUP AS G
                    LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                    LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                    WHERE G.STATUS = 'ENABLED' 
                    AND G.ID NOT IN (
                        SELECT 
                            G.ID
                         FROM TBL_GROUP AS G
                         LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                         LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                         WHERE R.NAME = ? 
                    ) AND G.NAME LIKE ?
                `, [roleName, `%${groupName ? groupName : ''}%`]);
            const m: Map<number/*groupId*/, Group> = new Map();
            const groups: Group[] = q.reduce((groups: Group[], c: QueryI) => {
                const groupId: number = c.G_ID;
                const groupName: string = c.G_NAME;
                const groupDescription: string = c.G_DESCRIPTION;
                const groupStatus: string = c.G_STATUS;
                const groupIsSystem: boolean = c.G_IS_SYSTEM;
                if (!m.has(groupId)) {
                    const g: Group = {
                        id: groupId,
                        name: groupName,
                        description: groupDescription,
                        status: groupStatus,
                        isSystem: groupIsSystem,
                        roles: []
                    } as Group;
                    groups.push(g);
                    m.set(groupId, g);
                }
                const g: Group = m.get(groupId);
                const roleId: number = c.R_ID;
                const roleName: string = c.R_NAME;
                const roleDescription: string = c.R_DESCRIPTION;
                g.roles.push({
                    id: roleId,
                    name: roleName,
                    description: roleDescription
                } as Role);
                return groups;
            }, []);
            return groups;
        });
        fireEvent({
            type: "SearchForGroupsWithNoSuchRoleEvent",
            roleName, groupName, groups
        } as SearchForGroupsWithNoSuchRoleEvent);
        return groups;
    };


    /**
     *  ========================================
     *  === searchForGroupByName ===
     *  ========================================
     */
    async searchForGroupByName(groupName: string): Promise<Group[]> {
        const groups: Group[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                    SELECT 
                        G.ID AS G_ID,
                        G.NAME AS G_NAME,
                        G.DESCRIPTION AS G_DESCRIPTION,
                        G.STATUS AS G_STATUS,
                        G.IS_SYSTEM AS G_IS_SYSTEM,
                        R.ID AS R_ID,
                        R.NAME AS R_NAME,
                        R.DESCRIPTION AS R_DESCRIPTION
                    FROM TBL_GROUP AS G
                    LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                    LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                    WHERE G.STATUS = 'ENABLED' AND G.NAME LIKE ? LIMIT 10 OFFSET 0
                `, [`%${groupName}%`]);
            const m: Map<number/*groupId*/, Group> = new Map();
            const groups: Group[] = q.reduce((groups: Group[], c: QueryI) => {
                const groupId: number = c.G_ID;
                const groupName: string = c.G_NAME;
                const groupDescription: string = c.G_DESCRIPTION;
                const groupStatus: string = c.G_STATUS;
                const groupIsSystem: boolean = c.G_IS_SYSTEM;
                if (!m.has(groupId)) {
                    const g: Group = {
                        id: groupId,
                        name: groupName,
                        description: groupDescription,
                        status: groupStatus,
                        isSystem: groupIsSystem,
                        roles: []
                    } as Group;
                    groups.push(g);
                    m.set(groupId, g);
                }
                const g: Group = m.get(groupId);
                const roleId: number = c.R_ID;
                const roleName: string = c.R_NAME;
                const roleDescription: string = c.R_DESCRIPTION;
                g.roles.push({
                    id: roleId,
                    name: roleName,
                    description: roleDescription
                } as Role);
                return groups;
            }, []);
            return groups;
        });
        fireEvent({
            type: "SearchForGroupByNameEvent",
            groupName, groups
        } as SearchForGroupByNameEvent);
        return groups;
    };


    /**
     *  ========================================
     *  === getGroupsWithRole ===
     *  ========================================
     */
    async getGroupsWithRoleCount(roleName: string): Promise<number> {
        return await doInDbConnection(async (conn: Connection) => {
            const qTotal: QueryA = await conn.query(`
                    SELECT 
                        COUNT(*) AS COUNT
                    FROM TBL_GROUP AS G
                    WHERE G.STATUS = 'ENABLED'
                    AND G.ID IN (
                        SELECT 
                            G.ID
                         FROM TBL_GROUP AS G
                         LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                         LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                         WHERE R.NAME = ? 
                    )
                `, [roleName]);
            return qTotal;
        });
    }

    async getGroupsWithRole(roleName: string): Promise<Group[]> {
        const groups: Group[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                    SELECT 
                        G.ID AS G_ID,
                        G.NAME AS G_NAME,
                        G.DESCRIPTION AS G_DESCRIPTION,
                        G.STATUS AS G_STATUS,
                        G.IS_SYSTEM AS G_IS_SYSTEM,
                        R.ID AS R_ID,
                        R.NAME AS R_NAME,
                        R.DESCRIPTION AS R_DESCRIPTION
                    FROM TBL_GROUP AS G
                    LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                    LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                    WHERE G.STATUS = 'ENABLED' 
                    AND G.ID IN (
                        SELECT 
                            G.ID
                         FROM TBL_GROUP AS G
                         LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                         LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                         WHERE R.NAME = ? 
                    )
                `, [roleName]);
            const m: Map<number/*groupId*/, Group> = new Map();
            const groups: Group[] = q.reduce((groups: Group[], c: QueryI) => {
                const groupId: number = c.G_ID;
                const groupName: string = c.G_NAME;
                const groupDescription: string = c.G_DESCRIPTION;
                const groupStatus: string = c.G_STATUS;
                const groupIsSystem: boolean = c.G_IS_SYSTEM;
                if (!m.has(groupId)) {
                    const g: Group = {
                        id: groupId,
                        name: groupName,
                        description: groupDescription,
                        status: groupStatus,
                        isSystem: groupIsSystem,
                        roles: []
                    } as Group;
                    groups.push(g);
                    m.set(groupId, g);
                }
                const g: Group = m.get(groupId);
                const roleId: number = c.R_ID;
                const roleName: string = c.R_NAME;
                const roleDescription: string = c.R_DESCRIPTION;
                g.roles.push({
                    id: roleId,
                    name: roleName,
                    description: roleDescription
                } as Role);
                return groups;
            }, []);

            return groups;
        });
        fireEvent({
            type: "GetGroupsWithRoleEvent",
            roleName,
            groups
        } as GetGroupsWithRoleEvent);
        return groups;
    }


    /**
     *  ========================================
     *  === getGroupByName ===
     *  ========================================
     */
    async getGroupByName(groupName: string): Promise<Group> {
        const group: Group = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                    SELECT 
                        G.ID AS G_ID,
                        G.NAME AS G_NAME,
                        G.DESCRIPTION AS G_DESCRIPTION,
                        G.STATUS AS G_STATUS,
                        G.IS_SYSTEM AS G_IS_SYSTEM,
                        R.ID AS R_ID,
                        R.NAME AS R_NAME,
                        R.DESCRIPTION AS R_DESCRIPTION
                    FROM TBL_GROUP AS G
                    LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                    LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                    WHERE G.STATUS = 'ENABLED' AND G.NAME=? 
                `, [groupName]);

            const group: Group = q.reduce((group: Group, c: QueryI, index: number) => {
                const groupId: number = c.G_ID;
                const groupName: string = c.G_NAME;
                const groupDescription: string = c.G_DESCRIPTION;
                const groupStatus: string = c.G_STATUS;
                const groupIsSystem: boolean = c.G_IS_SYSTEM;
                if (!!!group) {
                    group = {
                        id: groupId,
                        name: groupName,
                        description: groupDescription,
                        status: groupStatus,
                        isSystem: groupIsSystem,
                        roles: []
                    } as Group;
                }
                const roleId: number = c.R_ID;
                const roleName: string = c.R_NAME;
                const roleDescription: string = c.R_DESCRIPTION;
                group.roles.push({
                    id: roleId,
                    name: roleName,
                    description: roleDescription
                } as Role);
                return group;
            }, null);

            return group;
        });
        fireEvent({
            type: "GetGroupByNameEvent",
            groupName, group
        } as GetGroupByNameEvent);
        return group;
    };


    /**
     *  ========================================
     *  === getGroupById ===
     *  ========================================
     */
    async getGroupById(groupId: number): Promise<Group> {
        const group: Group = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                    SELECT 
                        G.ID AS G_ID,
                        G.NAME AS G_NAME,
                        G.DESCRIPTION AS G_DESCRIPTION,
                        G.STATUS AS G_STATUS,
                        G.IS_SYSTEM AS G_IS_SYSTEM,
                        R.ID AS R_ID,
                        R.NAME AS R_NAME,
                        R.DESCRIPTION AS R_DESCRIPTION
                    FROM TBL_GROUP AS G
                    LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                    LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                    WHERE G.STATUS = 'ENABLED' AND G.ID=? 
                `, [groupId]);

            const group: Group = q.reduce((group: Group, c: QueryI, index: number) => {
                const groupId: number = c.G_ID;
                const groupName: string = c.G_NAME;
                const groupDescription: string = c.G_DESCRIPTION;
                const groupStatus: string = c.G_STATUS;
                const groupIsSystem: boolean = c.G_IS_SYSTEM;
                if (!!!group) {
                    group = {
                        id: groupId,
                        name: groupName,
                        description: groupDescription,
                        status: groupStatus,
                        isSystem: groupIsSystem,
                        roles: []
                    } as Group;
                }
                const roleId: number = c.R_ID;
                const roleName: string = c.R_NAME;
                const roleDescription: string = c.R_DESCRIPTION;
                group.roles.push({
                    id: roleId,
                    name: roleName,
                    description: roleDescription
                } as Role);
                return group;
            }, null);

            return group;
        });
        fireEvent({
            type: "GetGroupByIdEvent",
            groupId, group
        } as GetGroupByIdEvent);
        return group;
    };


    /**
     *  ========================================
     *  === getAllGroups ===
     *  ========================================
     */
    async getAllGroupsCount(): Promise<number> {
        return await doInDbConnection(async (conn: Connection) => {
            const qTotal: QueryA = await conn.query(`
                    SELECT 
                        COUNT(*) AS COUNT
                    FROM TBL_GROUP AS G
                    WHERE G.STATUS = 'ENABLED'
                `, []);
            return qTotal[0].COUNT;
        });
    };
    async getAllGroups(): Promise<Group[]> {
        const groups: Group[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                    SELECT 
                        G.ID AS G_ID,
                        G.NAME AS G_NAME,
                        G.DESCRIPTION AS G_DESCRIPTION,
                        G.STATUS AS G_STATUS,
                        G.IS_SYSTEM AS G_IS_SYSTEM,
                        R.ID AS R_ID,
                        R.NAME AS R_NAME,
                        R.DESCRIPTION AS R_DESCRIPTION
                    FROM TBL_GROUP AS G
                    LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                    LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                    WHERE G.STATUS = 'ENABLED'
                `, []);
            const m: Map<number/*groupId*/, Group> = new Map();
            const groups: Group[] = q.reduce((groups: Group[], c: QueryI) => {
                const groupId: number = c.G_ID;
                const groupName: string = c.G_NAME;
                const groupDescription: string = c.G_DESCRIPTION;
                const groupStatus: string = c.G_STATUS;
                const groupIsSystem: boolean = c.G_IS_SYSTEM;
                if (!m.has(groupId)) {
                    const g: Group = {
                        id: groupId,
                        name: groupName,
                        description: groupDescription,
                        status: groupStatus,
                        isSystem: groupIsSystem,
                        roles: []
                    } as Group;
                    groups.push(g);
                    m.set(groupId, g);
                }
                const g: Group = m.get(groupId);
                const roleId: number = c.R_ID;
                const roleName: string = c.R_NAME;
                const roleDescription: string = c.R_DESCRIPTION;
                g.roles.push({
                    id: roleId,
                    name: roleName,
                    description: roleDescription
                } as Role);
                return groups;
            }, []);
            return groups;
        });
        fireEvent({
            type: "GetAllGroupsEvent",
            groups
        } as GetAllGroupsEvent);
        return groups;
    }
}

const s = new GroupService()
export const
    deleteGroup = s.deleteGroup.bind(s),
    addOrUpdateGroup = s.addOrUpdateGroup.bind(s),
    searchForGroupsWithNoSuchRoleCount = s.searchForGroupsWithNoSuchRoleCount.bind(s),
    searchForGroupsWithNoSuchRole = s.searchForGroupsWithNoSuchRole.bind(s),
    searchForGroupByName = s.searchForGroupByName.bind(s),
    getGroupsWithRoleCount = s.getGroupsWithRoleCount.bind(s),
    getGroupsWithRole = s.getGroupsWithRole.bind(s),
    getGroupByName = s.getGroupByName.bind(s),
    getGroupById = s.getGroupById.bind(s),
    getAllGroupsCount = s.getAllGroupsCount.bind(s),
    getAllGroups = s.getAllGroups.bind(s);
