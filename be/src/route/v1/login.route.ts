import {Router, Request, Response, NextFunction} from "express";
import {check} from "express-validator";
import {validateMiddlewareFn} from "./common-middleware";

import * as jwt from 'jsonwebtoken';
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {PoolConnection} from "mariadb";
import {createJwtToken, hashedPassword} from "../../service";
import {LoginResponse} from "../../model/login.model";
import {JwtPayload} from "../../model/jwt.model";
import {User} from "../../model/user.model";
import config from "../../config";
import {Status} from "../../model/status.model";
import {Group} from "../../model/group.model";
import {Role} from "../../model/role.model";

const loginHttpAction = [
        check('username').isLength({min: 1}),
        check('password').isLength({min:1})
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const usrname: string = req.body.username;
        const password: string = hashedPassword(req.body.password);

        await doInDbConnection(async (conn: PoolConnection) => {

            const qUser: QueryA = await conn.query(`
                SELECT 
                    U.ID AS ID, 
                    U.USERNAME AS USERNAME, 
                    U.CREATION_DATE AS CREATION_DATE, 
                    U.LAST_UPDATE AS LAST_UPDATE, 
                    U.EMAIL AS EMAIL, 
                    U.FIRSTNAME AS FIRSTNAME, 
                    U.LASTNAME AS LASTNAME, 
                    U.ENABLED AS ENABLED, 
                    U.PASSWORD AS PASSWORD,
                    T.THEME AS THEME,
                    A.ID AS AVATAR_ID
                FROM TBL_USER AS U
                LEFT JOIN TBL_THEME AS T ON T.USER_ID = U.ID 
                LEFT JOIN TBL_USER_AVATAR AS A ON A.USER_ID = U.ID
                WHERE U.USERNAME = ? AND U.PASSWORD = ? AND STATUS= = ?
            `, [usrname, password, 'ENABLED']);

            if (qUser.length <= 0) { // no user found
                // todo: switch to error object
                res.status(401).json({});
            }

            const theme: string = qUser[0].THEME;
            const userId: number = qUser[0].ID;
            const username: string = qUser[0].USERNAME;
            const firstName: string = qUser[0].FIRSTNAME;
            const lastName: string = qUser[0].LASTNAME;
            const email: string = qUser[0].EMAIL;

            const qGroup: QueryA = await conn.query(`
                SELECT
                    G.ID AS G_ID,
                    G.NAME AS G_NAME,
                    G.DESCRIPTION AS G_DESCRIPTION,
                    G.STATUS AS G_STATUS,
                    R.ID AS R_ID,
                    R.NAME AS R_NAME,
                    R.DESCRIPTION AS R_DESCRIPTION
                FROM TBL_GROUP AS G
                LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.GROUP_ID = G.ID
                WHERE LUG.USER_ID = ? AND G.STATUS = ?
            `, [userId, 'ENABLED']);

            const groups: Group[] = [...qGroup.reduce((acc: Map<number, Group>, g: QueryI) => {
                if(!acc.has(g.G_ID)) {
                    acc.set(g.G_ID, {
                        id: g.G_ID,
                        name: g.G_NAME,
                        description: g.G_DESCRIPTION,
                        status: g.G_STATUS,
                        roles: []
                    } as Group);
                }
                const group: Group = acc.get(g.G_ID);
                group.roles.push(g.R_NAME);
                return acc;
            }, new Map<number, Group>()).values()];

            const user: User = {
                id: userId,
                username: username,
                firstName: firstName,
                lastName: lastName,
                theme,
                email,
                groups
            } as User;

            const jwtToken: string  = createJwtToken(user);

            res.status(200).json({
                jwtToken,
                status: 'SUCCESS',
                message: `Successfully logged in`,
                user
            } as LoginResponse)
        });
    }
];

const reg = (router: Router) => {
    router.post('/login', ...loginHttpAction) ;
}

export default reg;
