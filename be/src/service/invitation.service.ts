import {Invitation} from "../model/invitation.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";
import {ClientError} from "../route/v1/common-middleware";


export const getInvitationByCode = async (code: string): Promise<Invitation> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q1: QueryA = await conn.query(`
                SELECT 
                    R.ID AS ID, R.EMAIL AS EMAIL, R.CREATION_DATE AS CREATION_DATE, R.CODE AS CODE, R.ACTIVATED AS ACTIVATED, 
                    G.GROUP_ID AS GROUP_ID
                FROM TBL_INVITATION_REGISTRATION as R
                LEFT JOIN TBL_INVITATION_REGISTRATION_GROUP AS G ON G.INVITATION_REGISTRATION_ID = R.ID
                WHERE R.CODE = ?
            `, code);

        if (q1.length <= 0) {
            throw new ClientError(`Invalid code ${code}`);
        }

        const id: number = q1[0].ID;
        const activated: boolean = q1[0].ACTIVATED;
        const email: string = q1[0].EMAIL;
        const creationDate: Date = q1[0].CREATION_DATE;
        const groupIds: number[] = q1.reduce((acc: number[], c: QueryI) => {
            acc.push(c.GROUP_ID);
            return acc;
        }, []);

        const invitation: Invitation = {
            id,
            activated,
            creationDate,
            email,
            groupIds
        };
        return invitation;
    });
};