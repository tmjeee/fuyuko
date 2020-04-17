import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {SelfRegistration} from "../model/self-registration.model";
import {ApiResponse} from "../model/api-response.model";


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