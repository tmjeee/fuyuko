import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA} from "../../db";
import {PoolConnection} from "mariadb";
import {Registry} from "../../registry";
import {valid} from "semver";

const sendNoAvatarAvatar = async (res: Response, conn: PoolConnection) => {
    const q: QueryA = await conn.query('SELECT ID, NAME, MIME_TYPE, SIZE, CONTENT FROM TBL_GLOBAL_IMAGE WHERE TAG = ?',
        ['no-avatar']);
    if (q.length > 0) {
        res.setHeader('Content-Length', q[0].SIZE);
        res.status(200)
            .contentType(q[0].MIME_TYPE)
            .end(q[0].CONTENT);
    } else {
        res.end();
    }
}

const httpAction = [
    [
        check('userId')
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const userId = req.params.userId;

        await doInDbConnection(async (conn: PoolConnection) => {
            const q1: QueryA  = await conn.query(`SELECT ID, USER_ID, GLOBAL_AVATAR_ID, MIME_TYPE, SIZE, CONTENT FROM TBL_USER_AVATAR WHERE USER_ID = ?`,
                [userId]);
            if (q1.length > 0) { // have user avatar
                if (q1[0].CONTENT) { // have private user avatar
                    res.setHeader('Content-Length', q1[0].SIZE)
                    res.status(200)
                        .contentType(q1[0].MIME_TYPE)
                        .end(q1[0].CONTENT);
                } else if (q1[0].GLOBAL_AVATAR_ID) { // have a global avatar
                    const q2: QueryA = await conn.query('SELECT ID, NAME, MIME_TYPE, SIZE, CONTENT FROM TBL_GLOBAL_AVATAR WHERE ID = ?',
                        [q1[0].GLOBAL_AVATAR_ID]);
                    if(q2.length > 0) {
                        res.setHeader('Content-Length', q2[0].SIZE);
                        res.status(200)
                            .contentType(q2[0].MIME_TYPE)
                            .end(q2[0].CONTENT);
                    } else {
                        await sendNoAvatarAvatar(res, conn);
                    }
                } else {
                    await sendNoAvatarAvatar(res, conn);
                }
            } else {
                await sendNoAvatarAvatar(res, conn);
            }
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/user/:userId/avatar';
    registry.addItem('GET', p);
    router.get(p, ...httpAction)
}

export default reg;
