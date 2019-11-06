
import {doInDbConnection, QueryResponse} from '../../db';
import {PoolConnection} from "mariadb";
import uuid from 'uuid/v1';
import {Registration} from "../../model/registration.model";

export const register = async (username: string, email: string, password: string): Promise<Registration> => {

    const r: QueryResponse = await doInDbConnection(async (conn: PoolConnection) => {

        const r: QueryResponse = await conn.query(
            `
                INSERT INTO TBL_REGISTRATION (USERNAME, EMAIL, CREATION_DATE, TYPE, CODE, ACTIVATED
                VALUES (:username, :email, :creationDate, :type, :code, :activated);
            `,
            {
                username, email, creationDate: new Date(), type: 'self', code: uuid(), activated: false
            });

        return r;
    });

    return { registrationId: r.insertId, email, username, status: '', message: `User ${username} (${email}) registered`} as Registration;

};