
import {Request, Response, NextFunction, Router} from 'express';
import {body} from 'express-validator';

import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {validateMiddlewareFn} from "./common-middleware";

import {Connection} from "mariadb";
import {hashedPassword} from "../../service";
import {Registry} from "../../registry";
import {RegistrationResponse} from "../../model/api-response.model";


const selfRegister = async (username: string, email: string, firstName: string, lastName: string,  password: string): Promise<RegistrationResponse> => {

    const reg: RegistrationResponse = await doInDbConnection(async (conn: Connection) => {

        const q1: QueryA = await conn.query(
            `SELECT COUNT(*) AS COUNT FROM TBL_SELF_REGISTRATION WHERE (USERNAME = ? OR EMAIL = ?) AND ACTIVATED = ?`,
            [username, email, false]);
        const q2: QueryA = await conn.query(
            `SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE (USERNAME = ? OR EMAIL = ?) AND STATUS <> ? `,
            [username, email, 'DELETED'])

        if (!!q1[0].COUNT || !!q2[0].COUNT) {
            return { registrationId: null, email, username, status: 'ERROR', message: `Username ${username} or ${email} is already taken`} as RegistrationResponse;
        }

        const r: QueryResponse = await conn.query(
            `
                INSERT INTO TBL_SELF_REGISTRATION (USERNAME, EMAIL, FIRSTNAME, LASTNAME, PASSWORD, CREATION_DATE, ACTIVATED)
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `,
            [username, email, firstName, lastName, hashedPassword(password), new Date(), false]
        );
        if (r.affectedRows > 0) {
            return { registrationId: r.insertId, email, username, status: 'SUCCESS', message: `User ${username} (${email}) registered`} as RegistrationResponse;
        }
        return { registrationId: null, email, username, status: 'ERROR', message: `Unable to insert into DB ( Username ${username} or ${email} )`} as RegistrationResponse;
    });
    return reg;
};

const httpAction = [
    [
        body('username').exists().isLength({min:1}),
        body('email').exists().isLength({min:1}).isEmail(),
        body('password').exists().isLength({min:1}),
        body('firstName').exists().isLength({min:1}),
        body('lastName').exists().isLength({min:1})
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const username: string = req.body.username
        const email: string = req.body.email;
        const firstName: string = req.body.firstName;
        const lastName: string = req.body.lastName;
        const password: string = req.body.password;

        const r: RegistrationResponse = await selfRegister(username, email, firstName, lastName, password);

        res.status(200).json(r);
    }
];



const reg = (router: Router, registry: Registry) => {
    const p = '/self-register';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
