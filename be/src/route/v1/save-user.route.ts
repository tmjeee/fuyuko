import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "./v1-app.router";
import {check} from 'express-validator';
import {getJwtPayload, validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection} from "../../db";
import {PoolConnection} from "mariadb";
import {JwtPayload} from "../../model/jwt.model";

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

        doInDbConnection((conn: PoolConnection) => {
            if (firstName) {
                conn.query(`UPDATE TBL_USER SET FIRSTNAME = ? WHERE USER_ID = ?`, [firstName, userId]);
            }
            if (lastName){

            }
            if (email) {

            }
            if (theme){

            }
        });


        res.end();
    }
];

const reg = (router: Router, registry: Registry) =>{
    const p = '/user';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
