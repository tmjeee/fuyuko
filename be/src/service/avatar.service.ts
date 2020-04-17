import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";
import {GlobalAvatar} from "../model/avatar.model";
import {BinaryContent} from "../model/binary-content.model";

export const getUserAvatarInfo = async (): P


export const getGlobalAvatarContentByName = async (avatarName: string): Promise<BinaryContent> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q1: QueryA  = await conn.query(`SELECT ID, NAME, MIME_TYPE, SIZE, CONTENT FROM TBL_GLOBAL_AVATAR WHERE NAME = ?`,
            [avatarName]);
        if (q1.length > 0) { // have a global avatar
            return {
                id: q1[0].ID,
                name: q1[0].NAME,
                mimeType: q1[0].MIME_TYPE,
                size: q1[0].SIZE,
                content: q1[0].CONTENT
            } as BinaryContent;
        } else {
            return null;
        }
    });
};

export const getAllGlobalAvatars = async (): Promise<GlobalAvatar[]> => {
    return await doInDbConnection(async (conn: Connection) => {

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

        return globalAvatar;
    });
};