import {User} from "../model/user.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";
import {Group} from "../model/group.model";
import {Role} from "../model/role.model";

export const hasUserRoles = async (userId: number, roleNames: string[]): Promise<boolean> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
            SELECT COUNT(*) AS COUNT 
            FROM TBL_USER AS U 
            LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID
            LEFT JOIN TBL_TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
            LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = LUG.GROUP_ID
            LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
            WHERE U.ID = ? AND R.ROLE_NAME IN ? AND U.STATUS= ? AND G.STATUS = ?
        `, [userId, roleNames, 'ENABLED', 'ENABLED']);

        return !!(q.length && Number(q[0].COUNT));
    });
}

export const getUserById = async (userId: number): Promise<User>  => {
    return doInDbConnection(async (conn: Connection) => {
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
                R.ID AS R_ID,
                R.NAME AS R_NAME,
                R.DESCRIPTION AS R_DESCRIPTION
             FROM TBL_USER AS U 
             LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID 
             LEFT JOIN TBL_USER_THEME AS UT ON UT.USER_ID = U.ID
             LEFT JOIN TBL_GROUP AS G ON G.ID = LUG.GROUP_ID
             LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
             LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
             WHERE U.ID = ? AND U.STATUS = 'ENABLED' AND G.STATUS  'ENABLED'
        `, [userId]);

        const m: Map<number/*group id*/, Group> = new Map();
        const r: Map<number/*group id*/, Role[]> = new Map();

        return q.reduce((u: User, i: QueryI, index: number) => {
           if (index === 0) {
               u.id = i.U_ID;
               u.firstName = i.U_USERNAME;
               u.lastName = i.U_LASTNAME;
               u.username = i.U_USERNAME;
               u.theme = i.UT_THEME;
               u.email = i.U_EMAIL;
           }
           const groupId = i.G_ID;
           if (!m.has(groupId)) {
               const g: Group = ({
                   id: groupId,
                   name: i.G_NAME,
                   description: i.G_DESCRIPTION,
                   status: i.G_STATUS,
                   roles: []
               } as Group);
               u.groups.push(g);
               m.set(groupId, g);
               r.set(groupId, g.roles);
           }

           const roleId = i.R_ID;
           r.get(groupId).push({
             id: roleId,
             name: i.R_NAME,
             description: i.R_DESCRIPTION
           } as Role);


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

    });
}
