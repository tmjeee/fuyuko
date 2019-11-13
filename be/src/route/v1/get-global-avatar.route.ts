import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA} from "../../db";
import {PoolConnection} from "mariadb";
import {Registry} from "./v1-app.router";

const httpAction: any[] = [
    [
        check('avatarName').exists()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const avatarName: string  = req.params.avatarName;

        await doInDbConnection(async (conn: PoolConnection) => {
            const q1: QueryA  = await conn.query(`SELECT ID, NAME, MIME_TYPE, SIZE, CONTENT FROM TBL_GLOBAL_AVATAR WHERE NAME = ?`,
                [avatarName]);
            if (q1.length > 0) { // have a global avatar
                res.setHeader('Content-Length', q1[0].SIZE)
                res.status(200)
                    .contentType(q1[0].MIME_TYPE)
                    .end(q1[0].CONTENT);
            } else {
                res.end();
            }
        });
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = '/global/avatar/:avatarName';
    registry.addItem('GET', p);
    router.get(p, ...httpAction)
}

export default reg;
