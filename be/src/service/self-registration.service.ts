import {doInDbConnection, QueryA, QueryI, QueryResponse} from '../db';
import {Connection} from 'mariadb';
import {SelfRegistration} from '@fuyuko-common/model/self-registration.model';
import config from '../config';
import {sendEmail} from './send-email.service';
import {hashedPassword} from './password.service';
import {
    ApproveSelfRegistrationEvent, DeleteSelfRegistrationEvent,
    fireEvent,
    GetAllSelfRegistrationsEvent, SearchSelfRegistrationByUsernameEvent,
    SelfRegisterEvent
} from './event/event.service';


export interface SelfRegisterResult { errors: string[], registrationId?: number, email: string, username: string};
export interface ApproveSelfRegistrationResult {username: string, email: string, errors: string[]};

class SelfRegistrationService {

    /**
     * =============================
     * === selfRegister ===
     * ==============================
     */
    async selfRegister(username: string, email: string, firstName: string, lastName: string, password: string):
        Promise<SelfRegisterResult> {
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
                    registrationId: undefined,
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
            const selfRegisterResult: SelfRegisterResult = {
                errors,
                registrationId: undefined,
                email,
                username,
            };
            fireEvent({
                type: "SelfRegisterEvent",
                username, email, firstName, lastName, password, result: selfRegisterResult
            } as SelfRegisterEvent);
            return selfRegisterResult;
        });
    };


    /**
     * =============================
     * === approveSelfRegistration ===
     * ==============================
     */
    async approveSelfRegistration(selfRegistrationId: number): Promise<ApproveSelfRegistrationResult> {
        const approveSelfRegistrationResult: ApproveSelfRegistrationResult = await doInDbConnection(async (conn: Connection) => {
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
        fireEvent({
            type: "ApproveSelfRegistrationEvent",
            selfRegistrationId, approveSelfRegistrationResult
        } as ApproveSelfRegistrationEvent);
        return approveSelfRegistrationResult;
    }



    /**
     * =============================
     * === getAllSelfRegistrations ===
     * ==============================
     */
    async getAllSelfRegistrations(): Promise<SelfRegistration[]> {
        const selfRegistrations: SelfRegistration[] = await doInDbConnection(async (conn: Connection) => {
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
        fireEvent({
            type: "GetAllSelfRegistrationsEvent",
            selfRegistrations
        } as GetAllSelfRegistrationsEvent);
        return selfRegistrations;
    };



    /**
     * =========================================
     * === searchSelfRegistrationByUsername ===
     * =========================================
     */
    async searchSelfRegistrationsByUsername(username: string): Promise<SelfRegistration[]> {
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
        fireEvent({
            type: "SearchSelfRegistrationByUsernameEvent",
            username, selfRegistrations
        } as SearchSelfRegistrationByUsernameEvent);
        return selfRegistrations;
    };


    /**
     * =============================
     * === deleteSelfRegistration ===
     * ==============================
     */
    async deleteSelfRegistration(selfRegistrationId: number): Promise<boolean> {
        const result: boolean = await doInDbConnection(async (conn: Connection) => {
            const q: QueryResponse = await conn.query(`DELETE FROM TBL_SELF_REGISTRATION WHERE ID = ?`, [selfRegistrationId]);
            return (!!q.affectedRows)
        });
        fireEvent({
            type: "DeleteSelfRegistrationEvent",
            selfRegistrationId, result
        } as DeleteSelfRegistrationEvent);
        return result;
    }
}


const s = new SelfRegistrationService();
export const
    selfRegister = s.selfRegister.bind(s),
    approveSelfRegistration = s.approveSelfRegistration.bind(s),
    getAllSelfRegistrations = s.getAllSelfRegistrations.bind(s),
    searchSelfRegistrationsByUsername = s.searchSelfRegistrationsByUsername.bind(s),
    deleteSelfRegistration = s.deleteSelfRegistration.bind(s);
