import {Router, Request, Response, NextFunction} from "express";
import {validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {PoolConnection} from "mariadb";
import {GlobalAvatar} from "../../model/avatar.model";

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        await doInDbConnection(async (conn: PoolConnection) => {

            const q: QueryA = await conn.query(
                `SELECT ID, NAME, MIME_TYPE, SIZE FROM TBL_GLOBAL_AVATAR WHERE NAME <> 'no-avatar.jpg'`);

            const globalAvatar: GlobalAvatar[] = q.reduce((acc: GlobalAvatar[], curr: QueryI) => {
                acc.push({
                    id: curr.ID,
                    name: curr.NAME,
                    mimeType: curr.MIME_TYPE,
                    size: curr.SIZE
                } as GlobalAvatar);
                return acc;
            },[]);

            res.status(200).json(globalAvatar);
        });
    }
]

const reg = (router: Router) => {
    router.get('/global/avatars', ...httpAction);
}

export default reg;