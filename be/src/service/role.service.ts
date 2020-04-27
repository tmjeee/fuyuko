import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {Role} from "../model/role.model";

export const addOrUpdateRole = async (role: Role): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];
        if (role.id < 0) { // add
            const qc: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_ROLE WHERE NAME=? `, [role.name]);
            if (qc[0].COUNT > 0) {
                errors.push(`Role ${role.name} already exists`);
            } else {
               const q: QueryResponse = await conn.query(`INSERT INTO TBL_ROLE (NAME, DESCRIPTION) VALUES (?,?)`, [role.name, role.description]);
               if (q.affectedRows <= 0) {
                   errors.push(`Failed to insert role name ${role.name}`);
               }
            }
        } else { // update
            const qc: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_ROLE WHERE ID=?`, [role.id]);
            if (qc[0].COUNT > 0) {
                errors.push(`Role id ${role.id} do not exists`);
            } else {
                const q: QueryResponse = await conn.query(`UPDATE TBL_ROLE SET NAME=?, DESCRIPTION=? WHERE ID=?`, [role.name, role.description, role.id]);
                if (q.affectedRows <= 0) {
                    errors.push(`Failed to update role id ${role.id}`);
                }
            }
        }
        return errors;
    });
}

export const addRoleToGroup = async (groupId: number, roleName: string): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];

        const qa: QueryA = await conn.query('SELECT ID FROM TBL_ROLE WHERE NAME = ?', [roleName]);
        if (!!!qa.length) {
           errors.push(`Invalid role ${roleName}`, 'roleName');
           return errors;
        }
        const roleId: number = qa[0].ID;

        const q: QueryA = await conn.query(`
               SELECT COUNT(*) AS COUNT FROM TBL_LOOKUP_GROUP_ROLE WHERE GROUP_ID = ? AND ROLE_ID = ?
            `, [groupId, roleId]);

        if (!!q.length && !!!Number(q[0].COUNT)) {
            const q1: QueryResponse = await conn.query(`INSERT INTO TBL_LOOKUP_GROUP_ROLE (GROUP_ID, ROLE_ID) VALUES (?, ?)`, [groupId, roleId]);
            if (q1.affectedRows <= 0) {
               errors.push( `Role ${roleName} failed to be added to group ${groupId}`);
            }
        }
        return errors;
    });
};


export const getRoleByName = async (roleName: string): Promise<Role> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION FROM TBL_ROLE WHERE NAME=?`, roleName);
        if (q.length) {
            return {
               id: q[0].ID,
               name: q[0].NAME,
               description: q[0].DESCRIPTION
            } as Role;
        }
        return null;
    });
};

export const getAllRoles = async (): Promise<Role[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
                SELECT 
                    ID, NAME, DESCRIPTION
                FROM TBL_ROLE
            `);

        const roles: Role[] = q.map((i: QueryI) => {
            return {
                id: i.ID,
                name: i.NAME,
                description: i.DESCRIPTION
            } as Role;
        });

        return roles;
    });
};

export const removeRoleFromGroup = async (roleName: string, groupId: number): Promise<string[]> => {
    const errors: string[] = [];
    await doInDbConnection(async (conn: Connection) => {
        const qs: QueryA = await conn.query(`SELECT ID FROM TBL_ROLE WHERE NAME = ?`, [roleName]);
        if (qs.length <= 0) {
            errors.push(`Invalid role ${roleName}, roleName not found in system`);
        } else {
            const roleId: number = qs[0].ID;
            const q: QueryResponse = await conn.query(`
                DELETE FROM TBL_LOOKUP_GROUP_ROLE WHERE GROUP_ID = ? AND ROLE_ID = ?
            `, [groupId, roleId])

            if (q.affectedRows <= 0) {
               errors.push(`Role ${roleName} is not in group ${groupId}`);
            }
        }
    });
    return errors;
}