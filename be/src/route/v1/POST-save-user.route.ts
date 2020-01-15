import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {check} from 'express-validator';
import {
    aFnAnyTrue,
    getJwtPayload, v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {JwtPayload} from "../../model/jwt.model";
import {getUserById, hashedPassword} from "../../service";
import {User} from "../../model/user.model";
import {ROLE_EDIT} from "../../model/role.model";
import {QueryA} from "../../db/db";

const httpAction: any[] = [
    [
        check('userId').exists(),
        check('firstName'),
        check('lastName'),
        check('email'),
        check('theme'),
        check('password'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const theme = req.body.theme;
        const password = req.body.password;

        const jwtPayload: JwtPayload = getJwtPayload(res);
        const userId: number = jwtPayload.user.id;

        await doInDbConnection(async (conn: Connection) => {
            if (firstName) {
                await conn.query(`UPDATE TBL_USER SET FIRSTNAME = ? WHERE ID = ?`, [firstName, userId]);
            }
            if (lastName){
                await conn.query(`UPDATE TBL_USER SET LASTNAME = ? WHERE ID = ?`, [lastName, userId]);
            }
            if (email) {
                await conn.query(`UPDATE TBL_USER SET EMAIL = ? WHERE ID = ?`, [email, userId]);
            }
            if (password) {
                await conn.query(`UPDATE TBL_USER SET PASSWORD=? WHERE ID=?`, [hashedPassword(password), userId]);
            }
            if (theme){
                const q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_USER_THEME WHERE USER_ID=?`, [userId]);
                if (q[0].COUNT > 0) { // theme already exists, update
                    await conn.query(`UPDATE TBL_USER_THEME SET THEME=? WHERE USER_ID=?`, [theme, userId]);
                } else { // theme not already exists, insert
                    await conn.query(`INSERT INTO TBL_USER_THEME (THEME, USER_ID) VALUES (?,?)`, [theme, userId]);
                }
            }
        });

        const user: User = await doInDbConnection(async (conn: Connection) => {
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
