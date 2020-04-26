import {Invitation} from "../model/invitation.model";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {ClientError} from "../route/v1/common-middleware";
import {DELETED, ENABLED} from "../model/status.model";
import {hashedPassword} from "./password.service";
import config from "../config";
import uuid = require("uuid");
import {SendMailOptions} from "nodemailer";
import {sendEmail} from "./send-email.service";



/**
 * Send out invitation to register / activate account (through email)
 */
export const createInvitation = async (email: string, groupIds: number[] = [], sendMail:boolean = true, invitationCode?: string): Promise<string[]> => {

    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];

        const hasUserQuery: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE EMAIL = ?`, [email]);
        if (hasUserQuery[0].COUNT > 0) {
            errors.push(`Email ${email} has already been registered`);
            return errors;
        }


        const hasInvitationQuery: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_INVITATION_REGISTRATION WHERE EMAIL = ?`, [email]);
        if (hasInvitationQuery[0].COUNT > 0) {
            await conn.query(`DELETE FROM TBL_INVITATION_REGISTRATION WHERE EMAIL = ? `, [email]);
        }

        const code: string = invitationCode ? invitationCode : uuid();

        const q1: QueryResponse = await conn.query(
            `INSERT INTO TBL_INVITATION_REGISTRATION (EMAIL, CREATION_DATE, ACTIVATED, CODE) VALUES (?, ?, ?, ?)`,
            [email, new Date(), false, code]);
        const registrationId: number = q1.insertId;

        for (const gId of groupIds) {
            await conn.query(
                `INSERT INTO TBL_INVITATION_REGISTRATION_GROUP (INVITATION_REGISTRATION_ID, GROUP_ID) VALUES (?, ?)`,
                [registrationId, gId]);
        }

        if (sendMail) {
            const info: SendMailOptions = await sendEmail(email, 'Invitation to join Fukyko MDM',
                `
                Hello,
                
                You have been invited to join Fuyuko MDM. Please ${config["fe-url-base"]}/login-layout/activate/${code} to activate your 
                account.
                
                Enjoy! and welcome aboard.
            `);
        }
        return errors;
    });
};



export const activateInvitation = async (code: string, username: string, email: string, firstName: string,
                                         lastName: string, password: string): Promise<{ registrationId: number, errors: string[]}> => {

    let registrationId;

    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];
        const q1: QueryA = await conn.query(`
                SELECT ID, EMAIL, CREATION_DATE, CODE, ACTIVATED FROM TBL_INVITATION_REGISTRATION WHERE CODE=? AND ACTIVATED=?
            `, [code, false]);

        // do not allow creation if code is bad
        if (q1.length <= 0) { // bad code
            errors.push(`Code no longer active`);
            return errors;
        }

        registrationId = q1[0].ID;

        // do not allow creation if username already exists
        const qU1: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE (USERNAME = ?) AND STATUS <> ?
            `, [username, DELETED]);
        if (qU1.length > 0 && qU1[0].COUNT > 0) {
           errors.push(`User with either username ${username} already exists`);
           return { registrationId, errors };
        }

        // do not allow creation if email already exists
        const qU1_1: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE (EMAIL = ?) AND STATUS <> ?
            `, [email, DELETED]);
        if (qU1_1.length > 0 && qU1_1[0].COUNT > 0) {
           errors.push(`User with either email ${email} already exists`);
           return { registrationId, errors };
        }

        // do not allow activation if username or email has already being self-registered
        const qU2: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_SELF_REGISTRATION WHERE (EMAIL = ? OR USERNAME = ?) AND ACTIVATED = ? 
            `, [email, username, false]);
        if (qU1.length > 0 && qU1[0].COUNT > 0) {
           errors.push(`User with either username ${username} or email ${email} already registered`);
           return { registrationId, errors };
        }


        await conn.query(`UPDATE TBL_INVITATION_REGISTRATION SET ACTIVATED=? WHERE CODE=?`,[true, code]);

        const qGroups: QueryA = await conn.query(`
                SELECT GROUP_ID FROM TBL_INVITATION_REGISTRATION_GROUP WHERE INVITATION_REGISTRATION_ID = ? 
            `, [q1[0].ID]);

        // activate
        const qNewUser: QueryResponse = await conn.query(`
                INSERT INTO TBL_USER (USERNAME, EMAIL, FIRSTNAME, LASTNAME, STATUS, PASSWORD, CREATION_DATE, LAST_UPDATE) VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
            `, [username, email, firstName, lastName, ENABLED, hashedPassword(password), new Date(), new Date()]);

        const newUserId: number = qNewUser.insertId;

        await conn.query(`
                INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)
            `, [newUserId, config["default-theme"]]);

        for (const g of qGroups) {
            const gId: number = (g as QueryI).GROUP_ID;
            await conn.query(`
                    INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?,?)
                `, [newUserId, gId]);
        }
        return  { registrationId, errors };
    });
};


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