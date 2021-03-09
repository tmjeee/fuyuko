import {NextFunction, Request, Response, Router} from 'express';
import {Registry} from '../../registry';
import { param } from 'express-validator';
import {validateMiddlewareFn} from './common-middleware';
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from 'mariadb';
import {UserAvatar} from '@fuyuko-common/model/avatar.model';
import {makeApiError, makeApiErrorObj} from '../../util';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


// CHECKED

const send = (res: Response, i: UserAvatar) => {
    res.status(200).json({
        status: 'SUCCESS',
        message: `User avatar retrieved`,
        payload: i
    } as ApiResponse<UserAvatar>);
}

const sendNoAvatar = async (res: Response, conn: Connection) => {
    const q: QueryA = await conn.query('SELECT ID, NAME, MIME_TYPE, SIZE, CONTENT FROM TBL_GLOBAL_IMAGE WHERE TAG = ?',
        ['no-avatar']);
    if (q.length > 0) {
        send(res, {
            id: q[0].ID,
            name: q[0].NAME,
            size: q[0].SIZE,
            global: true,
            mimeType: q[0].MIME_TYPE
        })
    } else {
        res.status(500).json(
            makeApiErrorObj(
                makeApiError(`No default no-avatar found`, ``, ``, `API`)
            )
        )
    }
}

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const userId = req.params.userId;

        await doInDbConnection(async (conn: Connection) => {
            const q1: QueryA  = await conn.query(`SELECT ID, USER_ID, GLOBAL_AVATAR_ID, NAME, MIME_TYPE, SIZE, CONTENT FROM TBL_USER_AVATAR WHERE USER_ID = ?`,
                [userId]);
            if (q1.length > 0) { // have user avatar
                if (q1[0].CONTENT) { // have private user avatar
                    send(res, {
                      global: false,
                      id: q1[0].ID,
                      mimeType: q1[0].MIME_TYPE,
                      size: q1[0].SIZE,
                      name: q1[0].NAME,
                    });
                } else if (q1[0].GLOBAL_AVATAR_ID) { // have a global avatar
                    const q2: QueryA = await conn.query('SELECT ID, NAME, MIME_TYPE, SIZE, CONTENT FROM TBL_GLOBAL_AVATAR WHERE ID = ?',
                        [q1[0].GLOBAL_AVATAR_ID]);
                    if(q2.length > 0) {
                        send(res, {
                            global: true,
                            id: q2[0].ID,
                            mimeType: q2[0].MIME_TYPE,
                            size: q2[0].SIZE,
                            name: q2[0].NAME
                        });
                    } else {
                        await sendNoAvatar(res, conn);
                    }
                } else {
                    await sendNoAvatar(res, conn);
                }
            } else {
                await sendNoAvatar(res, conn);
            }
        });
    }
]


const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/avatar-info`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}


export default reg;