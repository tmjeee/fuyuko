
import {Request, Response, NextFunction, Router} from 'express';
import {check} from 'express-validator/check';

import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {RegistrationResponse} from "../../model/registration.model";
import {catchErrorMiddlewareFn, validateMiddlewareFn} from "./common-middleware";

import util from 'util';
import {PoolConnection} from "mariadb";


const selfRegister = async (username: string, email: string, password: string): Promise<RegistrationResponse> => {

    const reg: RegistrationResponse = await doInDbConnection(async (conn: PoolConnection) => {

        const q1: QueryA = await conn.query(
            `SELECT COUNT(*) AS COUNT FROM TBL_SELF_REGISTRATION WHERE USERNAME = ? OR EMAIL = ?`,
            [username, email]);
        const q2: QueryA = await conn.query(
            `SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE USERNAME = ? OR EMAIL = ?`,
            [username, email])

        if (!!q1[0].COUNT || !!q2[0].COUNT) {
            return { registrationId: null, email, username, status: 'ERROR', message: `Username ${username} or ${email} is already taken`} as RegistrationResponse;
        }

        const r: QueryResponse = await conn.query(
            `
                INSERT INTO TBL_SELF_REGISTRATION (USERNAME, EMAIL, CREATION_DATE, ACTIVATED)
                VALUES (?, ?, ?, ?);
            `,
            [username, email, new Date(), false]
        );
        if (r.affectedRows > 0) {
            return { registrationId: r.insertId, email, username, status: 'SUCCESS', message: `User ${username} (${email}) registered`} as RegistrationResponse;
        }
        return { registrationId: null, email, username, status: 'ERROR', message: `Unable to insert into DB ( Username ${username} or ${email} )`} as RegistrationResponse;
    });
    return reg;
};

const selfRegisterHttpAction = [
    catchErrorMiddlewareFn,
    [
        check('username').isLength({min:1}),
        check('email').isLength({min:1}).isEmail(),
        check('password').isLength({min:1})
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const username: string = req.body.username
        const email: string = req.body.email;
        const password: string = req.body.password;

        const r: RegistrationResponse = await selfRegister(username, email, password);

        res.status(200).json(r);
    }
];



const reg = (router: Router) => {
    router.post('/self-register', ...selfRegisterHttpAction);
};

export default reg;