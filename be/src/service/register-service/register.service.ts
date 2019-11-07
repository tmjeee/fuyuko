
import {doInDbConnection, QueryResponse, QueryA } from '../../db';
import {PoolConnection} from "mariadb";
import uuid from 'uuid/v1';
import {Registration} from "../../model/registration.model";
import util from 'util';


export const register = async (username: string, email: string, password: string): Promise<Registration> => {

    const reg: Registration = await doInDbConnection(async (conn: PoolConnection) => {

        const q1: QueryA = await conn.query(
            `SELECT COUNT(*) AS COUNT FROM TBL_REGISTRATION WHERE USERNAME = ? OR EMAIL = ?`,
            [username, email]);
        const q2: QueryA = await conn.query(
            `SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE USERNAME = ? OR EMAIL = ?`,
            [username, email])

        if (!!q1[0].COUNT || !!q2[0].COUNT) {
            return { registrationId: null, email, username, status: 'ERROR', message: `Username ${username} or ${email} is already taken`} as Registration;
        }

        const r: QueryResponse = await conn.query(
            `
                INSERT INTO TBL_REGISTRATION (USERNAME, EMAIL, CREATION_DATE, TYPE, CODE, ACTIVATED)
                VALUES (?, ?, ?, ?, ?, ?);
            `,
           [username, email, new Date(), 'self', uuid(), 0]
        );
        if (r.affectedRows > 0) {
            return { registrationId: r.insertId, email, username, status: 'SUCCESS', message: `User ${username} (${email}) registered`} as Registration;
        }
        return { registrationId: null, email, username, status: 'ERROR', message: `Unable to insert into DB ( Username ${username} or ${email} )`} as Registration;
    });
    return reg;
};