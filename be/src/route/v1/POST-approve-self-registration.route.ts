import {Router, Request, Response, NextFunction} from "express";
import {check} from "express-validator";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";
import {hashedPassword, sendEmail} from "../../service";
import config from '../../config';
import {RegistrationResponse} from "../../model/registration.model";
import {Registry} from "../../registry";
import {ROLE_ADMIN, ROLE_EDIT} from "../../model/role.model";

/**
 * Approve other users' self registration entries
 */
const httpAction = [
    [
        check('selfRegistrationId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const selfRegistrationId: number = Number(req.params.selfRegistrationId);

        doInDbConnection(async (conn: Connection) => {

            const q1: QueryA = await conn.query(`
                SELECT ID, USERNAME, EMAIL, CREATION_DATE, ACTIVATED, FIRSTNAME, LASTNAME, PASSWORD FROM TBL_SELF_REGISTRATION WHERE ID = ? AND ACTIVATED = ?
            `, [selfRegistrationId, false]);

            if (q1.length < 0) { // is not valid anymore (maybe already activated?)
                return res.status(400).json(makeApiErrorObj(
                    makeApiError(`Self registration id ${selfRegistrationId} is no longer active anymore`, 'registrationId', selfRegistrationId.toString(), 'api')
                ));
            }

            const username: string = q1[0].USERNAME;
            const email: string = q1[0].EMAIL;
            const firstName: string = q1[0].FIRSTNAME;
            const lastName: string = q1[0].LASTNAME;
            const password: string = q1[0].PASSWORD;

            const qUserExists: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE USERNAME = ? OR EMAIL = ?
            `, [username, email]);
            if (qUserExists.length > 0) { // user already exists
                return res.status(400).json(makeApiErrorObj(
                    makeApiError(`User with username ${username} or email ${email} already exists`, 'username,email', `${username},${email}`, 'api')
                ));
            }

            const qNewUser: QueryResponse = await conn.query(`
                INSERT INTO TBL_USER (USERNAME, EMAIL, FIRSTNAME, LASTNAME, STATUS, PASSWORD, CREATION_DATE, LAST_UPDATE) VALUES (?,?,?,?,?,?,?,?)
            `,[username, email, firstName, lastName, 'ENABLED', password, new Date(), new Date()]);

            const newUserId: number = qNewUser.insertId;

            await conn.query(`
                INSERT INTO TBL_THEME (USER_ID, THEME) VALUES (?,?)
            `, [newUserId, config["default-theme"]]);

            sendEmail(email,
                `Registration Success`,
                `
                    Hi ${firstName} ${lastName},
                    
                    Your self registration with username ${username} (${email}) has been approved.
                    
                    Log on and check it out at ${config["fe-url-base"]}
                    
                    Welcome aboard and Enjoy !!!
                `);

            res.status(200).json({
                email,
                message: `Self registration approval for ${username} (${email}) success`,
                registrationId: selfRegistrationId,
                status: 'SUCCESS',
                username
            } as RegistrationResponse);
        });
    }
]


const reg = (router: Router, registry: Registry) => {
    const p = '/self-register/approve/:selfRegistrationId';
    registry.addItem('POST', p);
    router.post(p, ...httpAction)
}
export default reg;
