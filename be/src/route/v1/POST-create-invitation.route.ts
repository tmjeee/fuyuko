import {NextFunction, Router, Request, Response } from "express";
import {check} from "express-validator";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {sendEmail} from "../../service";
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {SendMailOptions} from "nodemailer";
import config from "../../config";
import uuid = require("uuid");
import {CreateInvitationResponse} from "../../model/invitation.model";
import {Registry} from "../../registry";
import {ROLE_ADMIN} from "../../model/role.model";

/**
 * Send out invitation to register / activate account (through email)
 */
export const createInvitation = async (email: string, groupIds: number[] = []): Promise<CreateInvitationResponse> => {

    return await doInDbConnection(async (conn: Connection) => {

        const hasUserQuery: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE EMAIL = ?`, [email]);
        if (hasUserQuery[0].COUNT > 0) {
            return {
               status: 'ERROR',
               message: `Email ${email} has already been registered`
            } as CreateInvitationResponse;
        }


        console.log('*************************** create invitation');

        const hasInvitationQuery: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_INVITATION_REGISTRATION WHERE EMAIL = ?`, [email]);
        if (hasInvitationQuery[0].COUNT > 0) {
            await conn.query(`DELETE FROM TBL_INVITATION_REGISTRATION WHERE EMAIL = ? `, [email]);
        }

        console.log('****** count ', hasInvitationQuery[0].COUNT);

        const code: string = uuid();

        const q1: QueryResponse = await conn.query(
            `INSERT INTO TBL_INVITATION_REGISTRATION (EMAIL, CREATION_DATE, ACTIVATED, CODE) VALUES (?, ?, ?, ?)`,
            [email, new Date(), false, code]);
        const registrationId: number = q1.insertId;

        console.log('**** insertId', registrationId);

        for (const gId of groupIds) {
            await conn.query(
                `INSERT INTO TBL_INVITATION_REGISTRATION_GROUP (INVITATION_REGISTRATION_ID, GROUP_ID) VALUES (?, ?)`,
                [registrationId, gId]);
        }

        console.log('groupids', groupIds);

        const info: SendMailOptions = await sendEmail(email, 'Invitation to join Fukyko MDM',
            `
                Hello,
                
                You have been invited to join Fuyuko MDM. Please ${config["fe-url-base"]}/login-layout/activate/${code} to activate your 
                account.
                
                Enjoy! and welcome aboard.
            `);

        return {
            status: 'SUCCESS',
            message: 'Invitation Created'
        } as CreateInvitationResponse;

    });
};

const httpAction = [
    [
        check('email').isLength({min:1}).isEmail(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const email: string = req.body.email;
        const groupIds: number[] = req.body.groupIds;

        const createInvitationResponse: CreateInvitationResponse = await createInvitation(email, groupIds);

        res.status(createInvitationResponse.status == 'SUCCESS' ? 200 : 400).json(createInvitationResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/create-invitation';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
