import {User} from '@fuyuko-common/model/user.model';
import {doInDbConnection, QueryA, QueryI, QueryResponse} from '../db';
import {Connection} from 'mariadb';
import {Group} from '@fuyuko-common/model/group.model';
import {Role} from '@fuyuko-common/model/role.model';
import {BinaryContent} from '@fuyuko-common/model/binary-content.model';
import {ENABLED, Status} from '@fuyuko-common/model/status.model';
import {hashedPassword} from './password.service';
import { Themes } from '@fuyuko-common/model/theme.model';
import {
    AddUserEvent,
    AddUserToGroupEvent,
    ChangeUserStatusEvent, DeleteUserEvent, DeleteUserFromGroupEvent,
    fireEvent,
    GetNoAvatarContentEvent,
    GetUserAvatarContentEvent, GetUserByIdEvent, GetUserByUsernameEvent,
    GetUsersByStatusEvent,
    GetUsersInGroupEvent, HasAllUserRolesEvent, HasAnyUserRolesEvent, HasNoneUserRolesEvent,
    SearchForUserNotInGroupEvent, SearchUserByUsernameAndStatusEvent,
    UpdateUserEvent
} from './event/event.service';


export interface AddUserInput {username: string, firstName: string, lastName: string, email: string, password: string, theme?: string, status?: Status};
export interface UpdateUserInput { userId: number, firstName?: string, lastName?: string, email?: string, theme?: string, password?: string};

class UserService {

    /**
     * ============================
     * === addUser ===
     * ============================
     */
    async addUser(u: AddUserInput): Promise<string[]> {
        const _theme: string = u.theme ? u.theme : Themes[Themes.THEME_DEEPPURPLE_AMBER_LIGHT];
        const errors: string[] = await doInDbConnection(async (conn: Connection) => {
            const errors: string[] = [];
            const qc: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE USERNAME=? OR EMAIL=?`, [u.username, u.email]);
            if (qc[0].COUNT > 0) {
                errors.push(`User with username ${u.username} or email ${u.email} already exists`);
            } else {
                const u1: QueryResponse = await conn.query(`
            INSERT INTO TBL_USER (USERNAME, EMAIL, STATUS, PASSWORD, FIRSTNAME, LASTNAME) VALUES (?, ?, ?, ?, ?, ?)
        `, [u.username, u.email, u.status ? u.status : ENABLED, hashedPassword(u.password), u.firstName, u.lastName]);
                if (u1.affectedRows <= 0) {
                    errors.push(`Failed to insert user ${u.username}`);
                } else {
                    // insert theme
                    const insertedUserId = u1.insertId;
                    const q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_USER_THEME WHERE USER_ID=?`, insertedUserId);
                    if (q[0].COUNT <= 0) {
                        const qr: QueryResponse = await conn.query('INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?,?)', [insertedUserId, _theme]);
                        if (qr.affectedRows <= 0) {
                            errors.push(`Failed to inser theme ${_theme} for user ${u.username}`);
                        }
                    }
                }
            }
            return errors;
        });
        fireEvent({
            type: "AddUserEvent",
            input: u,
            errors
        } as AddUserEvent);
        return errors;
    }

    /**
     * ============================
     * === updateUser ===
     * ============================
     */
    async updateUser(u: UpdateUserInput): Promise<string[]> {
        const errors: string[] = await doInDbConnection(async (conn: Connection) => {
            const errors: string[] = [];
            if (u.firstName) {
                const q: QueryResponse = await conn.query(`UPDATE TBL_USER SET FIRSTNAME = ? WHERE ID = ?`, [u.firstName, u.userId]);
                if (q.affectedRows <= 0) {
                    errors.push(`Failed to update user id ${u.userId} first name`);
                }
            }
            if (u.lastName){
                const q: QueryResponse = await conn.query(`UPDATE TBL_USER SET LASTNAME = ? WHERE ID = ?`, [u.lastName, u.userId]);
                if (q.affectedRows <= 0) {
                    errors.push (`Failed to update user id ${u.userId} last name`);
                }
            }
            if (u.email) {
                const q: QueryResponse = await conn.query(`UPDATE TBL_USER SET EMAIL = ? WHERE ID = ?`, [u.email, u.userId]);
                if (q.affectedRows <= 0) {
                    errors.push (`Failed to update user id ${u.userId} email`);
                }
            }
            if (u.password) {
                const q: QueryResponse = await conn.query(`UPDATE TBL_USER SET PASSWORD=? WHERE ID=?`, [hashedPassword(u.password), u.userId]);
                if (q.affectedRows <= 0) {
                    errors.push(`Failed to update user id ${u.userId} password`);
                }
            }
            if (u.theme){
                const q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_USER_THEME WHERE USER_ID=?`, [u.userId]);
                if (q[0].COUNT > 0) { // theme already exists, update
                    const q: QueryResponse = await conn.query(`UPDATE TBL_USER_THEME SET THEME=? WHERE USER_ID=?`, [u.theme, u.userId]);
                    if (q.affectedRows <= 0) {
                        errors.push(`Failed to update user id ${u.userId} theme`);
                    }
                } else { // theme not already exists, insert
                    const q: QueryResponse = await conn.query(`INSERT INTO TBL_USER_THEME (THEME, USER_ID) VALUES (?,?)`, [u.theme, u.userId]);
                    if (q.affectedRows <= 0) {
                        errors.push(`Failed to add user id ${u.userId} theme`);
                    }
                }
            }
            return errors;
        });
        fireEvent({
            type: "UpdateUserEvent",
            input: u, errors
        } as UpdateUserEvent);
        return errors;
    }

    /**
     * ============================
     * === changeUserStatus ===
     * ============================
     */
    async changeUserStatus(userId: number, status: string): Promise<boolean> {
        const result: boolean = await doInDbConnection(async (conn: Connection) => {
            const q: QueryResponse  = await conn.query(`UPDATE TBL_USER SET STATUS = ? WHERE ID = ? `, [status, userId]);
            return (q.affectedRows > 0);
        });
        fireEvent({
            type: "ChangeUserStatusEvent",
            userId, status, result
        } as ChangeUserStatusEvent);
        return result;
    };


    /**
     * ============================
     * === addUserToGroup ===
     * ============================
     */
    async addUserToGroup(userId: number, groupId: number): Promise<string[]> {
        const errors: string[] = await doInDbConnection(async (conn: Connection) => {
            const errors: string[] = [];
            const q1: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_LOOKUP_USER_GROUP WHERE GROUP_ID = ? AND USER_ID = ?`, [groupId, userId]);
            if (q1.length > 0 && q1[0].COUNT > 0) {
                errors.push(`User ${userId} already in group ${groupId}`, 'userId');
                return errors;
            }

            await conn.query(`INSERT INTO TBL_LOOKUP_USER_GROUP (GROUP_ID, USER_ID) VALUES (?, ?)`, [groupId, userId]);
            return errors;
        });
        fireEvent({
            type: "AddUserToGroupEvent",
            userId, groupId, errors
        } as AddUserToGroupEvent);
        return errors;
    }


    /**
     * ============================
     * === getUsersInGroup ===
     * ============================
     */
    async getUsersInGroup(groupId: number): Promise<User[]> {
        const u: User[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                    U.ID AS U_ID,
                    U.USERNAME AS U_USERNAME,
                    U.CREATION_DATE AS U_CREATION_DATE,
                    U.LAST_UPDATE AS U_LAST_UPDATE,
                    U.EMAIL AS U_EMAIL,
                    U.FIRSTNAME AS U_FIRSTNAME,
                    U.LASTNAME AS U_LASTNAME,
                    U.STATUS AS U_STATUS,
                    U.PASSWORD AS U_PASSWORD,
                    UT.THEME AS UT_THEME,
                    G.ID AS G_ID,
                    G.NAME AS G_NAME,
                    G.DESCRIPTION AS G_DESCRIPTION,
                    G.STATUS AS G_STATUS,
                    G.IS_SYSTEM AS G_IS_SYSTEM,
                    R.ID AS R_ID,
                    R.NAME AS R_NAME,
                    R.DESCRIPTION AS R_DESCRIPTION
                FROM TBL_USER AS U 
                LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID 
                LEFT JOIN TBL_USER_THEME AS UT ON UT.USER_ID = U.ID
                LEFT JOIN TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
                LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                WHERE U.STATUS = 'ENABLED' AND G.STATUS = 'ENABLED'
                AND U.ID IN (
                    SELECT 
                        U.ID
                    FROM TBL_USER AS U 
                    LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID
                    LEFT JOIN TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
                    WHERE G.ID = ?
                )
            `, [groupId]);


            const u: Map<number/*user id*/, User> = new Map();
            const g: Map<string/*<user id>_<group id>*/, Group> = new Map();
            const r: Map<string/*<user id>_<group id>_<role id>*/, Role> = new Map();


            return q.reduce((acc: User[], i: QueryI, index: number) => {
                    const userId = i.U_ID;
                    const uKey = `${userId}`;
                    if (!u.has(userId)) {
                        const user: User = ({
                            id: i.U_ID,
                            username: i.U_USERNAME,
                            firstName: i.U_FIRSTNAME,
                            lastName: i.U_LASTNAME,
                            email: i.U_EMAIL,
                            theme: i.UT_THEME,
                            groups: []
                        } as User);
                        u.set(userId, user);
                        acc.push(user);
                    }

                    const groupId = i.G_ID;
                    const gKey = `${userId}_${groupId}`;
                    if (!g.has(gKey)) {
                        const group: Group = ({
                            id: i.G_ID,
                            name: i.G_NAME,
                            description: i.G_DESCRIPTION,
                            status: i.G_STATUS,
                            isSystem: i.G_IS_SYSTEM,
                            roles: []
                        });
                        g.set(gKey, group);
                        u.get(userId).groups.push(group);
                    }

                    const roleId = i.R_ID;
                    const rKey = `${userId}_${groupId}_${roleId}`;
                    if (!r.has(rKey)) {
                        const role: Role = {
                            id: i.R_ID,
                            name: i.R_NAME,
                            description: i.R_DESCRIPTION
                        } as Role;
                        r.set(rKey, role);
                        g.get(gKey).roles.push(role);
                    }

                    return acc;
                }, []
            );
        });
        fireEvent({
            type: "GetUsersInGroupEvent",
            groupId, users: u
        } as GetUsersInGroupEvent);
        return u;
    };


    /**
     * ============================
     * === getUsersByStatus ===
     * ============================
     */
    async getUsersByStatus(status: Status): Promise<User[]> {
        const u: User[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                    U.ID AS U_ID,
                    U.USERNAME AS U_USERNAME,
                    U.CREATION_DATE AS U_CREATION_DATE,
                    U.LAST_UPDATE AS U_LAST_UPDATE,
                    U.EMAIL AS U_EMAIL,
                    U.FIRSTNAME AS U_FIRSTNAME,
                    U.LASTNAME AS U_LASTNAME,
                    U.STATUS AS U_STATUS,
                    U.PASSWORD AS U_PASSWORD,
                    UT.THEME AS UT_THEME,
                    G.ID AS G_ID,
                    G.NAME AS G_NAME,
                    G.DESCRIPTION AS G_DESCRIPTION,
                    G.STATUS AS G_STATUS,
                    G.IS_SYSTEM AS G_IS_SYSTEM,
                    R.ID AS R_ID,
                    R.NAME AS R_NAME,
                    R.DESCRIPTION AS R_DESCRIPTION
                FROM TBL_USER AS U 
                LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID 
                LEFT JOIN TBL_USER_THEME AS UT ON UT.USER_ID = U.ID
                LEFT JOIN TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
                LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                WHERE U.STATUS = ? -- AND G.STATUS = 'ENABLED'
            `, [status]);


            const u: Map<number/*user id*/, User> = new Map();
            const g: Map<string/*<user id>_<group id>*/, Group> = new Map();
            const r: Map<string/*<user id>_<group id>_<role id>*/, Role> = new Map();


            return q.reduce((acc: User[], i: QueryI, index: number) => {
                    const userId = i.U_ID;
                    const uKey = `${userId}`;
                    if (!u.has(userId)) {
                        const user: User = ({
                            id: i.U_ID,
                            username: i.U_USERNAME,
                            firstName: i.U_FIRSTNAME,
                            lastName: i.U_LASTNAME,
                            email: i.U_EMAIL,
                            theme: i.UT_THEME,
                            groups: []
                        } as User);
                        u.set(userId, user);
                        acc.push(user);
                    }

                    const groupId = i.G_ID;
                    const gKey = `${userId}_${groupId}`;
                    if (!g.has(gKey)) {
                        const group: Group = ({
                            id: i.G_ID,
                            name: i.G_NAME,
                            description: i.G_DESCRIPTION,
                            status: i.G_STATUS,
                            isSystem: i.G_IS_SYSTEM,
                            roles: []
                        });
                        g.set(gKey, group);
                        u.get(userId).groups.push(group);
                    }

                    const roleId = i.R_ID;
                    const rKey = `${userId}_${groupId}_${roleId}`;
                    if (!r.has(rKey)) {
                        const role: Role = {
                            id: i.R_ID,
                            name: i.R_NAME,
                            description: i.R_DESCRIPTION
                        } as Role;
                        r.set(rKey, role);
                        g.get(gKey).roles.push(role);
                    }

                    return acc;
                }, []
            );
        });
        fireEvent({
            type: "GetUsersByStatusEvent",
            status, users: u
        } as GetUsersByStatusEvent);
        return u;
    };


    /**
     * ============================
     * === getNoAvatarContent ===
     * ============================
     */
    private async getNoAvatarContent(conn: Connection): Promise<BinaryContent> {
        const q: QueryA = await conn.query('SELECT ID, NAME, MIME_TYPE, SIZE, CONTENT FROM TBL_GLOBAL_IMAGE WHERE TAG = ?',
            ['no-avatar']);
        let binaryContent = null;
        if (q.length > 0) {
            binaryContent = {
                id: q[0].ID,
                name: q[0].NAME,
                mimeType: q[0].MIME_TYPE,
                size: q[0].SIZE,
                content: q[0].CONTENT
            } as BinaryContent;
        }
        fireEvent({
            type: "GetNoAvatarContentEvent",
            binaryContent
        } as GetNoAvatarContentEvent);
        return binaryContent;
    };



    /**
     * ============================
     * === getUserAvatarContent ===
     * ============================
     */
    async getUserAvatarContent(userId: number): Promise<BinaryContent> {
        const binaryContent: BinaryContent = await doInDbConnection(async (conn: Connection) => {
            const q1: QueryA  = await conn.query(`SELECT ID, USER_ID, GLOBAL_AVATAR_ID, NAME, MIME_TYPE, SIZE, CONTENT FROM TBL_USER_AVATAR WHERE USER_ID = ?`,
                [userId]);
            if (q1.length > 0) { // have user avatar
                if (q1[0].CONTENT) { // have private user avatar
                    return {
                        id: q1[0].ID,
                        name: q1[0].NAME,
                        mimeType: q1[0].MIME_TYPE,
                        size: q1[0].SIZE,
                        content: q1[0].CONTENT
                    } as BinaryContent;
                } else if (q1[0].GLOBAL_AVATAR_ID) { // have a global avatar
                    const q2: QueryA = await conn.query('SELECT ID, NAME, MIME_TYPE, SIZE, CONTENT FROM TBL_GLOBAL_AVATAR WHERE ID = ?',
                        [q1[0].GLOBAL_AVATAR_ID]);
                    if(q2.length > 0) {
                        return {
                            id: q2[0].ID,
                            name: q2[0].NAME,
                            mimeType: q2[0].MIME_TYPE,
                            size: q2[0].SIZE,
                            content: q2[0].CONTENT
                        } as BinaryContent;
                    } else {
                        return await this.getNoAvatarContent(conn);
                    }
                } else {
                    return await this.getNoAvatarContent(conn);
                }
            } else {
                return await this.getNoAvatarContent(conn);
            }
        });
        fireEvent({
            type: "GetUserAvatarContentEvent",
            userId, binaryContent
        } as GetUserAvatarContentEvent);
        return binaryContent;
    };


    /**
     * ============================
     * === searchForUserNotInGroup ===
     * ============================
     */
    async searchForUserNotInGroup(groupId: number, username?: string): Promise<User[]> {
        const u: User[] = await doInDbConnection(async (conn: Connection) => {

            const q: QueryA = await conn.query(`
                SELECT 
                    U.ID AS U_ID,
                    U.USERNAME AS U_USERNAME,
                    U.CREATION_DATE AS U_CREATION_DATE,
                    U.LAST_UPDATE AS U_LAST_UPDATE,
                    U.EMAIL AS U_EMAIL,
                    U.FIRSTNAME AS U_FIRSTNAME,
                    U.LASTNAME AS U_LASTNAME,
                    U.STATUS AS U_STATUS,
                    U.PASSWORD AS U_PASSWORD,
                    UT.THEME AS UT_THEME,
                    G.ID AS G_ID,
                    G.NAME AS G_NAME,
                    G.DESCRIPTION AS G_DESCRIPTION,
                    G.STATUS AS G_STATUS,
                    G.IS_SYSTEM AS G_IS_SYSTEM,
                    R.ID AS R_ID,
                    R.NAME AS R_NAME,
                    R.DESCRIPTION AS R_DESCRIPTION
                FROM TBL_USER AS U 
                LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID 
                LEFT JOIN TBL_USER_THEME AS UT ON UT.USER_ID = U.ID
                LEFT JOIN TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
                LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                WHERE U.STATUS = 'ENABLED' AND (G.STATUS IS NULL OR G.STATUS = 'ENABLED')
                AND U.ID NOT IN (
                    SELECT 
                        U.ID
                    FROM TBL_USER AS U 
                    LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID
                    LEFT JOIN TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
                    WHERE G.ID = ? 
                ) AND U.USERNAME LIKE ?
            `, [groupId, `%${username ? username : ''}%`]);


            const u: Map<number/*user id*/, User> = new Map();
            const g: Map<string/*<user id>_<group id>*/, Group> = new Map();
            const r: Map<string/*<user id>_<group id>_<role id>*/, Role> = new Map();


            return q.reduce((acc: User[], i: QueryI, index: number) => {
                    const userId = i.U_ID;
                    const uKey = `${userId}`;
                    if (!u.has(userId)) {
                        const user: User = ({
                            id: i.U_ID,
                            username: i.U_USERNAME,
                            firstName: i.U_FIRSTNAME,
                            lastName: i.U_LASTNAME,
                            email: i.U_EMAIL,
                            theme: i.UT_THEME,
                            groups: []
                        } as User);
                        u.set(userId, user);
                        acc.push(user);
                    }

                    const groupId = i.G_ID;
                    const gKey = `${userId}_${groupId}`;
                    if (!g.has(gKey)) {
                        const group: Group = ({
                            id: i.G_ID,
                            name: i.G_NAME,
                            description: i.G_DESCRIPTION,
                            status: i.G_STATUS,
                            isSystem: i.G_IS_SYSTEM,
                            roles: []
                        });
                        g.set(gKey, group);
                        u.get(userId).groups.push(group);
                    }

                    const roleId = i.R_ID;
                    const rKey = `${userId}_${groupId}_${roleId}`;
                    if (!r.has(rKey)) {
                        const role: Role = {
                            id: i.R_ID,
                            name: i.R_NAME,
                            description: i.R_DESCRIPTION
                        } as Role;
                        r.set(rKey, role);
                        g.get(gKey).roles.push(role);
                    }

                    return acc;
                }, []
            );
        });
        fireEvent({
            type: "SearchForUserNotInGroupEvent",
            groupId, username, users: u
        } as SearchForUserNotInGroupEvent)
        return u;
    }


    /**
     * ============================
     * === searchUserByUsernameAndStatus ===
     * ============================
     */
    async searchUserByUsernameAndStatus(status: string, username?: string): Promise<User[]> {
        const u: User[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                    U.ID AS U_ID,
                    U.USERNAME AS U_USERNAME,
                    U.CREATION_DATE AS U_CREATION_DATE,
                    U.LAST_UPDATE AS U_LAST_UPDATE,
                    U.EMAIL AS U_EMAIL,
                    U.FIRSTNAME AS U_FIRSTNAME,
                    U.LASTNAME AS U_LASTNAME,
                    U.STATUS AS U_STATUS,
                    U.PASSWORD AS U_PASSWORD,
                    UT.THEME AS UT_THEME,
                    G.ID AS G_ID,
                    G.NAME AS G_NAME,
                    G.DESCRIPTION AS G_DESCRIPTION,
                    G.STATUS AS G_STATUS,
                    G.IS_SYSTEM AS G_IS_SYSTEM,
                    R.ID AS R_ID,
                    R.NAME AS R_NAME,
                    R.DESCRIPTION AS R_DESCRIPTION
                FROM TBL_USER AS U 
                LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID 
                LEFT JOIN TBL_USER_THEME AS UT ON UT.USER_ID = U.ID
                LEFT JOIN TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
                LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                WHERE U.STATUS = ? AND (G.STATUS = 'ENABLED' OR G.STATUS IS NULL) AND U.USERNAME LIKE ? 
            `, [status, `%${username ? username : ''}%`]);


            const u: Map<number/*user id*/, User> = new Map();
            const g: Map<string/*<user id>_<group id>*/, Group> = new Map();
            const r: Map<string/*<user id>_<group id>_<role id>*/, Role> = new Map();


            return q.reduce((acc: User[], i: QueryI, index: number) => {
                    const userId = i.U_ID;
                    const uKey = `${userId}`;
                    if (!u.has(userId)) {
                        const user: User = ({
                            id: i.U_ID,
                            username: i.U_USERNAME,
                            firstName: i.U_FIRSTNAME,
                            lastName: i.U_LASTNAME,
                            email: i.U_EMAIL,
                            theme: i.UT_THEME,
                            groups: []
                        } as User);
                        u.set(userId, user);
                        acc.push(user);
                    }

                    const groupId = i.G_ID;
                    const gKey = `${userId}_${groupId}`;
                    if (!g.has(gKey)) {
                        const group: Group = ({
                            id: i.G_ID,
                            name: i.G_NAME,
                            description: i.G_DESCRIPTION,
                            status: i.G_STATUS,
                            isSystem: i.G_IS_SYSTEM,
                            roles: []
                        });
                        g.set(gKey, group);
                        u.get(userId).groups.push(group);
                    }

                    const roleId = i.R_ID;
                    const rKey = `${userId}_${groupId}_${roleId}`;
                    if (!r.has(rKey)) {
                        const role: Role = {
                            id: i.R_ID,
                            name: i.R_NAME,
                            description: i.R_DESCRIPTION
                        } as Role;
                        r.set(rKey, role);
                        g.get(gKey).roles.push(role);
                    }

                    return acc;
                }, []
            );
        });
        fireEvent({
            type: "SearchUserByUsernameAndStatusEvent",
            username, status, users: u
        } as SearchUserByUsernameAndStatusEvent);
        return u;
    };


    /**
     * ============================
     * === deleteUserFromGroup ===
     * ============================
     */
    async deleteUserFromGroup(userId: number, groupId: number): Promise<string[]> {
        const errors: string[] = [];
        await doInDbConnection(async (conn: Connection) => {

            const qCount: QueryA = await conn.query(`SELECT COUNT(*) FROM TBL_LOOKUP_USER_GROUP WHERE USER_ID = ? AND GROUP_ID = ? `, [userId, groupId]);
            if (!qCount.length && !Number(qCount[0].COUNT)) { // aleady exists
                errors.push(`User ${userId} not in group ${groupId}`);
            } else {
                const q: QueryResponse = await conn.query(`DELETE FROM TBL_LOOKUP_USER_GROUP WHERE USER_ID=? AND GROUP_ID=?`, [userId, groupId]);
                if (!q.affectedRows) {
                    errors.push(`Failed to delete user with id ${userId} from group with id ${groupId}`);
                }
            }
        });
        fireEvent({
            type: "DeleteUserFromGroupEvent",
            userId, groupId, errors
        } as DeleteUserFromGroupEvent);
        return errors;
    }

    /**
     * ============================
     * === deleteUser ===
     * ============================
     */
    async deleteUser(userId: number): Promise<boolean> {
        const result: boolean = await doInDbConnection(async (conn: Connection) => {
            const q: QueryResponse = await conn.query(`
                UPDATE TBL_USER SET STATUS = ? WHERE ID = ?
            `, ['DELETED', userId]);
            return (!!q.affectedRows);
        });
        fireEvent({
            type: "DeleteUserEvent",
            userId, result
        } as DeleteUserEvent);
        return result;
    };


    /**
     * ============================
     * === hasAllUserRoles ===
     * ============================
     */
    async hasAllUserRoles(userId: number, roleNames: string[]): Promise<boolean> {
        const result: boolean = await doInDbConnection(async (conn: Connection) => {
            let r = true;
            for (const roleName of roleNames) {
                const q: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT 
                FROM TBL_USER AS U 
                LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID
                LEFT JOIN TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
                LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = LUG.GROUP_ID
                LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                WHERE U.ID = ? AND R.NAME IN ? AND U.STATUS= ? AND G.STATUS = ?
            `, [userId, [roleName], 'ENABLED', 'ENABLED']);

                if (q[0].COUNT === 0) { // role not found for this user
                    // if any role is not found it is a false, we return
                    r = false;
                    break;
                }
            }
            return r;
        });
        fireEvent({
            type: "HasAllUserRolesEvent",
            userId, roleNames, result
        } as HasAllUserRolesEvent);
        return result;
    };

    /**
     * ============================
     * === hasAnyUserRoles ===
     * ============================
     */
    async hasAnyUserRoles(userId: number, roleNames: string[]): Promise<boolean> {
        const result: boolean = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
            SELECT COUNT(*) AS COUNT 
            FROM TBL_USER AS U 
            LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID
            LEFT JOIN TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
            LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = LUG.GROUP_ID
            LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
            WHERE U.ID = ? AND R.NAME IN ? AND U.STATUS= ? AND G.STATUS = ?
        `, [userId, roleNames, 'ENABLED', 'ENABLED']);

            return !!(q.length && Number(q[0].COUNT));
        });
        fireEvent({
            type: "HasAnyUserRolesEvent",
            userId, roleNames, result
        } as HasAnyUserRolesEvent);
        return result;
    }


    /**
     * ============================
     * === hasNoneUserRoles ===
     * ============================
     */
    async hasNoneUserRoles(userId: number, roleNames: string[]): Promise<boolean> {
        const result: boolean = await doInDbConnection(async (conn: Connection) => {
            let r = true;
            for (const roleName of roleNames) {
                const q: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT 
                FROM TBL_USER AS U 
                LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID
                LEFT JOIN TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
                LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = LUG.GROUP_ID
                LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                WHERE U.ID = ? AND R.NAME IN ? AND U.STATUS= ? AND G.STATUS = ?
            `, [userId, [roleName], 'ENABLED', 'ENABLED']);

                if (q[0].COUNT > 0) { // role found for this user
                    // if any role is found it is a false, we return
                    r = false;
                    break;
                }
            }
            return r;
        });
        fireEvent({
            type: "HasNoneUserRolesEvent",
            userId, roleNames, result
        } as HasNoneUserRolesEvent);
        return result;
    }

    /**
     * ============================
     * === getUserByUsername ===
     * ============================
     */
    async getUserByUsername(username: string): Promise<User> {
        const user: User = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query( `
            SELECT 
                U.ID AS U_ID,
                U.USERNAME AS U_USERNAME,
                U.CREATION_DATE AS U_CREATION_DATE,
                U.LAST_UPDATE AS U_LAST_UPDATE,
                U.EMAIL AS U_EMAIL,
                U.FIRSTNAME AS U_FIRSTNAME,
                U.LASTNAME AS U_LASTNAME,
                U.STATUS AS U_STATUS,
                U.PASSWORD AS U_PASSWORD,
                UT.THEME AS UT_THEME,
                G.ID AS G_ID,
                G.NAME AS G_NAME,
                G.DESCRIPTION AS G_DESCRIPTION,
                G.STATUS AS G_STATUS,
                G.IS_SYSTEM AS G_IS_SYSTEM,
                R.ID AS R_ID,
                R.NAME AS R_NAME,
                R.DESCRIPTION AS R_DESCRIPTION
             FROM TBL_USER AS U 
             LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID 
             LEFT JOIN TBL_USER_THEME AS UT ON UT.USER_ID = U.ID
             LEFT JOIN TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
             LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
             LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
             WHERE U.USERNAME = ? AND U.STATUS = 'ENABLED' AND (G.STATUS = 'ENABLED' OR G.STATUS IS NULL)
        `, [username]);

            const m: Map<number/*group id*/, Group> = new Map();
            const r: Map<number/*group id*/, Role[]> = new Map();

            const u: User =  q.reduce((u: User, i: QueryI, index: number) => {
                if (index === 0) {
                    u.id = i.U_ID;
                    u.firstName = i.U_FIRSTNAME;
                    u.lastName = i.U_LASTNAME;
                    u.username = i.U_USERNAME;
                    u.theme = i.UT_THEME;
                    u.email = i.U_EMAIL;
                }
                const groupId = i.G_ID;
                if (groupId && !m.has(groupId)) {
                    const g: Group = ({
                        id: groupId,
                        name: i.G_NAME,
                        description: i.G_DESCRIPTION,
                        status: i.G_STATUS,
                        isSystem: i.G_IS_SYSTEM,
                        roles: []
                    } as Group);
                    u.groups.push(g);
                    m.set(groupId, g);
                    r.set(groupId, g.roles);
                }

                const roleId = i.R_ID;
                if (roleId && groupId) {
                    r.get(groupId).push({
                        id: roleId,
                        name: i.R_NAME,
                        description: i.R_DESCRIPTION
                    } as Role);
                }
                return u;
            }, {
                id: null,
                firstName: null,
                lastName: null,
                username: null,
                theme: null,
                email: null,
                groups: []
            } as User);

            return (u.id) ? u : null;
        });
        fireEvent({
            type: "GetUserByUsernameEvent",
            username, user
        } as GetUserByUsernameEvent);
        return user;
    };

    /**
     * ============================
     * === getUserById ===
     * ============================
     */
    async getUserById(userId: number): Promise<User>  {
        const user: User = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(
                `SELECT 
                U.ID AS U_ID,
                U.USERNAME AS U_USERNAME,
                U.CREATION_DATE AS U_CREATION_DATE,
                U.LAST_UPDATE AS U_LAST_UPDATE,
                U.EMAIL AS U_EMAIL,
                U.FIRSTNAME AS U_FIRSTNAME,
                U.LASTNAME AS U_LASTNAME,
                U.STATUS AS U_STATUS,
                U.PASSWORD AS U_PASSWORD,
                UT.THEME AS UT_THEME,
                G.ID AS G_ID,
                G.NAME AS G_NAME,
                G.DESCRIPTION AS G_DESCRIPTION,
                G.STATUS AS G_STATUS,
                G.IS_SYSTEM AS G_IS_SYSTEM,
                R.ID AS R_ID,
                R.NAME AS R_NAME,
                R.DESCRIPTION AS R_DESCRIPTION
             FROM TBL_USER AS U 
             LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID 
             LEFT JOIN TBL_USER_THEME AS UT ON UT.USER_ID = U.ID
             LEFT JOIN TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
             LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
             LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
             WHERE U.ID = ? AND U.STATUS = 'ENABLED' AND (G.STATUS = 'ENABLED' OR G.STATUS IS NULL)
        `, [userId]);

            const m: Map<number/*group id*/, Group> = new Map();
            const r: Map<number/*group id*/, Role[]> = new Map();

            const u: User = q.reduce((u: User, i: QueryI, index: number) => {
                if (index === 0) {
                    u.id = i.U_ID;
                    u.firstName = i.U_FIRSTNAME;
                    u.lastName = i.U_LASTNAME;
                    u.username = i.U_USERNAME;
                    u.theme = i.UT_THEME;
                    u.email = i.U_EMAIL;
                }
                const groupId = i.G_ID;
                if (groupId && !m.has(groupId)) {
                    const g: Group = ({
                        id: groupId,
                        name: i.G_NAME,
                        description: i.G_DESCRIPTION,
                        status: i.G_STATUS,
                        isSystem: i.G_IS_SYSTEM,
                        roles: []
                    } as Group);
                    u.groups.push(g);
                    m.set(groupId, g);
                    r.set(groupId, g.roles);
                }

                const roleId = i.R_ID;
                if (roleId && groupId) {
                    r.get(groupId).push({
                        id: roleId,
                        name: i.R_NAME,
                        description: i.R_DESCRIPTION
                    } as Role);
                }
                return u;
            }, {
                id: null,
                firstName: null,
                lastName: null,
                username: null,
                theme: null,
                email: null,
                groups: []
            } as User);

            return (u.id ? u : null);
        });
        fireEvent({
            type: "GetUserByIdEvent",
            userId, user
        } as GetUserByIdEvent);
        return user;
    }
}

const s = new UserService();
export const
    addUser = s.addUser.bind(s),
    updateUser = s.updateUser.bind(s),
    changeUserStatus = s.changeUserStatus.bind(s),
    addUserToGroup = s.addUserToGroup.bind(s),
    getUsersInGroup = s.getUsersInGroup.bind(s),
    getUsersByStatus = s.getUsersByStatus.bind(s),
    getUserAvatarContent = s.getUserAvatarContent.bind(s),
    searchForUserNotInGroup = s.searchForUserNotInGroup.bind(s),
    searchUserByUsernameAndStatus = s.searchUserByUsernameAndStatus.bind(s),
    deleteUserFromGroup = s.deleteUserFromGroup.bind(s),
    deleteUser = s.deleteUser.bind(s),
    hasAllUserRoles = s.hasAllUserRoles.bind(s),
    hasAnyUserRoles = s.hasAnyUserRoles.bind(s),
    hasNoneUserRoles = s.hasNoneUserRoles.bind(s),
    getUserByUsername = s.getUserByUsername.bind(s),
    getUserById = s.getUserById.bind(s);