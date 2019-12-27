import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {GlobalAvatar} from "../../model/avatar.model";
import {Registry} from "../../registry";

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        await doInDbConnection(async (conn: Connection) => {

            const q: QueryA = await conn.query(
                `SELECT ID, NAME, MIME_TYPE, SIZE FROM TBL_GLOBAL_AVATAR`);

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

const reg = (router: Router, registry: Registry) => {
    const p = '/global/avatars';
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
