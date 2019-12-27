import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {check} from 'express-validator';
import {getJwtPayload, validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {JwtPayload} from "../../model/jwt.model";
import {getUserById} from "../../service";
import {User} from "../../model/user.model";

const httpAction: any[] = [
    [
        check('userId').exists(),
        check('firstName'),
        check('lastName'),
        check('email'),
        check('theme'),
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const theme = req.body.theme;

        const jwtPayload: JwtPayload = getJwtPayload(res);
        const userId: number = jwtPayload.user.id;

        const user: User = await doInDbConnection(async (conn: Connection) => {
            if (firstName) {
                conn.query(`UPDATE TBL_USER SET FIRSTNAME = ? WHERE USER_ID = ?`, [firstName, userId]);
            }
            if (lastName){
                conn.query(`UPDATE TBL_USER SET LASTNAME = ? WHERE USER_ID = ?`, [lastName, userId]);
            }
            if (email) {
                conn.query(`UPDATE TBL_USER SET EMAIL = ? WHERE USER_ID = ?`, [email, userId]);
            }
            if (theme){
                conn.query(`UPDATE TBL_USER SET THEME = ? WHERE USER_ID = ? `, [theme, userId]);
            }

            return await getUserById(userId);
        });


        res.status(200).json(user);
    }
];

const reg = (router: Router, registry: Registry) =>{
    const p = '/user';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
