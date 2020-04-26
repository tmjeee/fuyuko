import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {SelfRegistration} from "../model/self-registration.model";
import config from "../config";
import {sendEmail} from "./send-email.service";
import {hashedPassword} from "./password.service";


export const selfRegister = async (username: string, email: string, firstName: string, lastName: string, password: string):
    Promise<{errors: string[], registrationId: number, email: string, username: string}> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];

        const q1: QueryA = await conn.query(
            `SELECT COUNT(*) AS COUNT FROM TBL_SELF_REGISTRATION WHERE (USERNAME = ? OR EMAIL = ?) AND ACTIVATED = ?`,
            [username, email, false]);
        const q2: QueryA = await conn.query(
            `SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE (USERNAME = ? OR EMAIL = ?) AND STATUS <> ? `,
            [username, email, 'DELETED'])

        if (!!q1[0].COUNT || !!q2[0].COUNT) {
            errors.push(`username ${username} or ${email} is already taken`);
            return {
                errors,
                registrationId: null,
                email,
                username,
            };
        }

        const r: QueryResponse = await conn.query(
            `
                INSERT INTO TBL_SELF_REGISTRATION (USERNAME, EMAIL, FIRSTNAME, LASTNAME, PASSWORD, CREATION_DATE, ACTIVATED)
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `,
            [username, email, firstName, lastName, hashedPassword(password), new Date(), false]
        );
        if (r.affectedRows > 0) {
            return {
                errors,
                registrationId: r.insertId,
                email,
                username,
            }
        }
        errors.push(`Unable to insert into DB ( Username ${username} or ${email} )`);
        return {
            errors,
            registrationId: null,
            email,
            username,
        };
    });
};


export const approveSelfRegistration = async (selfRegistrationId: number): Promise<{username: string, email: string, errors: string[]}> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];

        const q1: QueryA = await conn.query(`
                SELECT ID, USERNAME, EMAIL, CREATION_DATE, ACTIVATED, FIRSTNAME, LASTNAME, PASSWORD FROM TBL_SELF_REGISTRATION WHERE ID = ? AND ACTIVATED = ?
            `, [selfRegistrationId, false]);

        if (q1.length < 0) { // is not valid anymore (maybe already activated?)
           errors.push(`Self registration id ${selfRegistrationId} is no longer active anymore`);
           return {
               username: null,
               email: null,
               errors
           };
        }

        const username: string = q1[0].USERNAME;
        const email: string = q1[0].EMAIL;
        const firstName: string = q1[0].FIRSTNAME;
        const lastName: string = q1[0].LASTNAME;
        const password: string = q1[0].PASSWORD;

        const qUserExists: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE USERNAME = ? OR EMAIL = ?
            `, [username, email]);
        if (qUserExists[0].COUNT > 0) { // user already exists
            errors.push(`User with username ${username} or email ${email} already exists`);
            return {
                username, email,
                errors
            };
        }

        const qNewUser: QueryResponse = await conn.query(`
                INSERT INTO TBL_USER (USERNAME, EMAIL, FIRSTNAME, LASTNAME, STATUS, PASSWORD, CREATION_DATE, LAST_UPDATE) VALUES (?,?,?,?,?,?,?,?)
            `,[username, email, firstName, lastName, 'ENABLED', password, new Date(), new Date()]);

        const newUserId: number = qNewUser.insertId;

        await conn.query(`
                INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?,?)
            `, [newUserId, config["default-theme"]]);

        await conn.query(`UPDATE TBL_SELF_REGISTRATION SET ACTIVATED = true WHERE ID = ?`, q1[0].ID);

        sendEmail(email,
            `Registration Success`,
            `
                    Hi ${firstName} ${lastName},
                    
                    Your self registration with username ${username} (${email}) has been approved.
                    
                    Log on and check it out at ${config["fe-url-base"]}
                    
                    Welcome aboard and Enjoy !!!
                `);

        return {
            username, email, errors
        };
    });
}

export const getAllSelfRegistrations = async (): Promise<SelfRegistration[]> => {
    return await doInDbConnection(async (conn: Connection) => {

        const  q: QueryA = await conn.query(`
                SELECT
                    ID,
                    USERNAME,
                    EMAIL,
                    FIRSTNAME,
                    LASTNAME,
                    PASSWORD,
                    CREATION_DATE,
                    ACTIVATED
                FROM TBL_SELF_REGISTRATION
                WHERE ACTIVATED = false
            `);

        const selfRegistrations: SelfRegistration[] = q.map((i: QueryI) => {
            return {
                id: i.ID,
                username: i.USERNAME,
                email: i.EMAIL,
                firstName: i.FIRSTNAME,
                lastName: i.LASTNAME,
                creationDate: i.CREATION_DATE,
                activated: i.ACTIVATED
            } as SelfRegistration
        });

        return selfRegistrations;
    });
};

export const searchSelfRegistrationsByUsername = async (username: string): Promise<SelfRegistration[]> => {
    const selfRegistrations: SelfRegistration[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
            SELECT 
               ID, 
               USERNAME,
               EMAIL,
               FIRSTNAME,
               LASTNAME,
               PASSWORD,
               CREATION_DATE,
               ACTIVATED 
            FROM TBL_SELF_REGISTRATION
            WHERE USERNAME LIKE ? AND ACTIVATED IS FALSE
          `, [`%${username ? username : ''}%`]);

        return q.reduce((a: SelfRegistration[], i: QueryI) => {
            const s: SelfRegistration = {
                id: i.ID,
                username: i.USERNAME,
                activated: i.ACTIVATED,
                creationDate: i.CREATION_DATE,
                lastName: i.LASTNAME,
                firstName: i.FIRSTNAME,
                email: i.EMAIL
            };
            a.push(s);
            return a;
        }, []);
    });
    return selfRegistrations;
};


export const deleteSelfRegistration = async (selfRegistrationId: number): Promise<boolean> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryResponse = await conn.query(`DELETE FROM TBL_SELF_REGISTRATION WHERE ID = ?`, [selfRegistrationId]);
        return (q.affectedRows)
    });
}