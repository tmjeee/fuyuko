import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {Role} from "../model/role.model";


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

            if (q.affectedRows) {
               errors.push(`Role ${roleName} is not in group ${groupId}`);
            }
        }
    });
    return errors;
}