import {NextFunction, Router, Request, Response} from "express";
import {param, body} from 'express-validator';
import {validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";
import {hashedPassword} from "../../service";
import config from '../../config';
import {Activation} from "../../model/activation.model";
import {Registry} from "../../registry";
import {ApiResponse} from "../../model/api-response.model";
import {DELETED, ENABLED} from "../../model/status.model";

// CHECKED

/**
 * Activate invitation received (eg. through email)
 */
const httpAction = [
    [
        param('code').isLength({ min: 1 }),
        body('username').exists({checkFalsy: true, checkNull: true}),
        body('email').exists().isEmail(),
        body('firstName').exists(),
        body('lastName').exists(),
        body('password').exists()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response , next: NextFunction ) => {
        const code = req.params.code;
        const username = req.body.username;
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        let registrationId;

        const r: boolean = await doInDbConnection(async (conn: Connection) => {
            const q1: QueryA = await conn.query(`
                SELECT ID, EMAIL, CREATION_DATE, CODE, ACTIVATED FROM TBL_INVITATION_REGISTRATION WHERE CODE=? AND ACTIVATED=?
            `, [code, false]);

            // do not allow creation if code is bad
            if (q1.length <= 0) { // bad code
                res.status(400).json(makeApiErrorObj(
                    makeApiError(`Code no longer active`, 'code', code, 'api')
                ));
                return false;
            }

            registrationId = q1[0].ID;

            // do not allow creation if username already exists
            const qU1: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE (USERNAME = ?) AND STATUS <> ?
            `, [username, DELETED]);
            if (qU1.length > 0 && qU1[0].COUNT > 0) {
                res.status(400).json(makeApiErrorObj(
                    makeApiError(`User with either username ${username} already exists`)
                ));
                return false;
            }

            // do not allow creation if email already exists
            const qU1_1: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE (EMAIL = ?) AND STATUS <> ?
            `, [email, DELETED]);
            if (qU1_1.length > 0 && qU1_1[0].COUNT > 0) {
                res.status(400).json(makeApiErrorObj(
                    makeApiError(`User with either email ${email} already exists`)
                ));
                return false;
            }

            // do not allow activation if username or email has already being self-registered
            const qU2: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_SELF_REGISTRATION WHERE (EMAIL = ? OR USERNAME = ?) AND ACTIVATED = ? 
            `, [email, username, false]);
            if (qU1.length > 0 && qU1[0].COUNT > 0) {
                res.status(400).json(makeApiErrorObj(
                    makeApiError(`User with either username ${username} or email ${email} already registered`)
                ));
                return false;
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
            return true;
        });

        if (r) { // if no errors send before
            res.status(200).json( {
                status: 'SUCCESS',
                message: `Successfully activated ${username} (${email})`,
                payload: {
                    email,
                    registrationId,
                    message: `Successfully activated ${username} (${email})`,
                    status: 'SUCCESS',
                    username
                }
            } as ApiResponse<Activation>);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/activate-invitation/:code';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
