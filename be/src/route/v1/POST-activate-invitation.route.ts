import {NextFunction, Router, Request, Response} from "express";
import {check} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";
import {hashedPassword} from "../../service";
import config from '../../config';
import {Activation} from "../../model/activation.model";
import {Registry} from "../../registry";

/**
 * Activate invitation received (eg. through email)
 */
const httpAction = [
    [
        check('code').isLength({ min: 1 }),
        check('username').exists({checkFalsy: true, checkNull: true}),
        check('email').exists().isEmail(),
        check('firstName').exists(),
        check('lastName').exists(),
        check('password').exists()
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

        await doInDbConnection(async (conn: Connection) => {
            const q1: QueryA = await conn.query(`
                SELECT ID, EMAIL, CREATION_DATE, CODE, ACTIVATED FROM TBL_INVITATION_REGISTRATION WHERE CODE=? AND ACTIVATED=?
            `, [code, false]);

            if (q1.length <= 0) { // bad code
                res.status(400).json(makeApiErrorObj(
                    makeApiError(`Code no longer active`, 'code', code, 'api')
                ));
                return;
            }

            registrationId = q1[0].ID;

            const qU1: QueryA = await conn.query(`
                SELECT COUNT(*) FROM TBL_USER WHERE (EMAIL = ? OR USERNAME = ?) AND STATUS <> ?
            `, [email, username, 'DELETED']);
            if (qU1.length > 0) {
                res.status(400).json(makeApiErrorObj(
                    makeApiError(`User with either username ${username} or email ${email} already exists`)
                ));
                return;
            }

            const qU2: QueryA = await conn.query(`
                SELECT COUNT(*) FROM TBL_SELF_REGISTRATION WHERE (EMAIL = ? OR USERNAME = ?) AND ACTIVATED = ? 
            `, [email, username, false]);
            if (qU1.length > 0) {
                res.status(400).json(makeApiErrorObj(
                    makeApiError(`User with either username ${username} or email ${email} already registered`)
                ));
                return;
            }


            await conn.query(`UPDATE TBL_INVITATION_REGISTRATION SET ACTIVATED=? WHERE CODE=?`,[true, code]);

            const qGroups: QueryA = await conn.query(`
                SELECT GROUP_ID FROM TBL_INVITATION_REGISTRATION_GROUP WHERE INVITATION_REGISTRATION_ID = ? 
            `, [q1[0].ID]);

            // activate
            const qNewUser: QueryResponse = await conn.query(`
                INSERT INTO TBL_USER (USERNAME, EMAIL, FIRSTNAME, LASTNAME, STATUS, PASSWORD, CREATION_DATE, LAST_UPDATE) VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
            `, [username, email, firstName, lastName, 'ENABLED', hashedPassword(password), new Date(), new Date()]);

            const newUserId: number = qNewUser.insertId;

            conn.query(`
                INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)
            `, [newUserId, config["default-theme"]]);

            for (const g of qGroups) {
                const gId: number = (g as QueryI).GROUP_ID;
                conn.query(`
                    INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?,?)
                `, [newUserId, gId]);
            }
        });

        res.status(200).json({
           email,
           registrationId,
           message: `Successfully activated ${username} (${email})`,
           status: 'SUCCESS',
           username
        } as Activation);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/activate-invitation/:code';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
