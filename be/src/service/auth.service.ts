import {User} from "../model/user.model";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {Group} from "../model/group.model";
import {Role} from "../model/role.model";
import {createJwtToken} from "./jwt.service";
import {DISABLED, ENABLED} from "../model/status.model";
import uuid = require("uuid");
import {hashedPassword, sendEmail} from "./index";
import {SendMailOptions} from "nodemailer";
import config from "../config";


export const isValidForgottenPasswordCode = async (code: string): Promise<boolean> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_FORGOT_PASSWORD WHERE CODE=? AND STATUS=?`, [code, ENABLED]);
        if (q[0].COUNT) {
            return true;
        }
        return false;
    });
}

export const resetForgottenPassword = async (code: string, password: string): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];
        const q: QueryA = await conn.query(`SELECT ID, USER_ID, CODE, STATUS FROM TBL_FORGOT_PASSWORD WHERE CODE=? AND STATUS=?`, [code, ENABLED]);
        if (q.length > 0) {
            const q0: QueryResponse = await conn.query(`UPDATE TBL_USER SET PASSWORD=? WHERE ID =?`, [hashedPassword(password), q[0].USER_ID]);
            if (q0.affectedRows <= 0) {
                errors.push(`Failed to reset password for code ${code}`);
            } else {
                const q1: QueryResponse = await conn.query(`UPDATE TBL_FORGOT_PASSWORD SET STATUS=? WHERE ID=?`, [DISABLED, q[0].ID])
                if (q1.affectedRows <= 0) {
                    errors.push(`Failed to disable code ${code}`);
                }
            }
        } else {
            errors.push(`Invalid code ${code}`);
        }
        return errors;
    });
};

export const forgotPassword = async (o: {username?: string, email?: string}): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = []
        if (!o.username && !o.email) {
            errors.push(`No username or email provided`);
        } else if (o.username) {
            const q: QueryA = await conn.query(`SELECT ID, USERNAME, FIRSTNAME, LASTNAME, EMAIL FROM TBL_USER WHERE USERNAME=? AND STATUS=?`, [o.username, ENABLED]);
            if (q.length > 0) { // found
                await registerForgottenPassword({
                    userId: q[0].ID,
                    email: q[0].EMAIL,
                    username: q[0].USERNAME,
                    firstName: q[0].FIRSTNAME,
                    lastName: q[0].LASTNAME
                });

            } else {
                errors.push(`Username ${o.username} do not exists`);
            }
        } else if (o.email) {
            const q: QueryA = await conn.query(`SELECT ID, USERNAME, FIRSTNAME, LASTNAME, EMAIL FROM TBL_USER WHERE EMAIL=? AND STATUS=?`, [o.email, ENABLED]);
            if (q.length > 0) { // found
                await registerForgottenPassword({
                    userId: q[0].ID,
                    email: q[0].EMAIL,
                    username: q[0].USERNAME,
                    firstName: q[0].FIRSTNAME,
                    lastName: q[0].LASTNAME
                });
            } else {
                errors.push(`Email ${o.email} do not exists`);
            }
        }
        return errors;
    });
};

const registerForgottenPassword = async (i: {userId: number, email: string, username: string, firstName: string, lastName: string}): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const code: string = uuid();
        const errors: string[] = []
        const q: QueryResponse = await conn.query(`INSERT INTO TBL_FORGOT_PASSWORD (USER_ID, CODE, STATUS) VALUES (?,?,?)`, [i.userId, code, ENABLED]);
        if (q.affectedRows <= 0) {
            errors.push(`Failed to register forgot password entry`);
        } else {
            const sendMailOptions: SendMailOptions = await sendEmail(i.email, `Rest Password`, `
                 Hi ${i.firstName} ${i.lastName} (a.k.a ${i.username}),
                 
                 Use this link
                 
                 ${config['fe-url-base']}/login-layout/reset-password/${code}
                 
                 to reset your password. If you did not engage a forgotten passsword reset, simply ignore this email. 
                 
                 Thanks and have a nice day :)
            `);
        }
        return errors;
    });
};


export const logout = async (user: User): Promise<void> => {
};


export const login = async (usrname: string, password: string): Promise<{errors: string[], user: User, jwtToken: string, theme: string }> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];

        const qUser: QueryA = await conn.query(`
                SELECT 
                    U.ID AS ID, 
                    U.USERNAME AS USERNAME, 
                    U.CREATION_DATE AS CREATION_DATE, 
                    U.LAST_UPDATE AS LAST_UPDATE, 
                    U.EMAIL AS EMAIL, 
                    U.FIRSTNAME AS FIRSTNAME, 
                    U.LASTNAME AS LASTNAME, 
                    U.STATUS AS STATUS, 
                    U.PASSWORD AS PASSWORD,
                    T.THEME AS THEME,
                    A.ID AS AVATAR_ID
                FROM TBL_USER AS U
                LEFT JOIN TBL_USER_THEME AS T ON T.USER_ID = U.ID 
                LEFT JOIN TBL_USER_AVATAR AS A ON A.USER_ID = U.ID
                WHERE U.USERNAME = ? AND U.PASSWORD = ? AND U.STATUS = ?
            `, [usrname, password, 'ENABLED']);

        if (qUser.length <= 0) { // no user found
            errors.push(`No user ${usrname} with such password found`);
            return {
               errors,
               user: null, jwtToken: null, theme: null
            };
        } else {

            const theme: string = qUser[0].THEME;
            const userId: number = qUser[0].ID;
            const username: string = qUser[0].USERNAME;
            const firstName: string = qUser[0].FIRSTNAME;
            const lastName: string = qUser[0].LASTNAME;
            const email: string = qUser[0].EMAIL;

            const qGroup: QueryA = await conn.query(`
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
                LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.GROUP_ID = G.ID
                WHERE LUG.USER_ID = ? AND G.STATUS = ?
            `, [userId, 'ENABLED']);

            const groups: Group[] = [...qGroup.reduce((acc: Map<number, Group>, g: QueryI) => {
                if(!acc.has(g.G_ID)) {
                    acc.set(g.G_ID, {
                        id: g.G_ID,
                        name: g.G_NAME,
                        description: g.G_DESCRIPTION,
                        status: g.G_STATUS,
                        isSystem: g.G_IS_SYSTEM,
                        roles: []
                    } as Group);
                }
                const group: Group = acc.get(g.G_ID);
                group.roles.push({
                    id: g.R_ID,
                    name: g.R_NAME,
                    description: g.R_DESCRIPTION
                } as Role);
                return acc;
            }, new Map<number, Group>()).values()];

            const user: User = {
                id: userId,
                username: username,
                firstName: firstName,
                lastName: lastName,
                theme,
                email,
                groups
            } as User;

            const jwtToken: string  = createJwtToken(user);

            return {
                errors,
                jwtToken,
                user,
                theme
            };
        }
    });
};