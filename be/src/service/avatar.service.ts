import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {GlobalAvatar} from "../model/avatar.model";
import {BinaryContent} from "../model/binary-content.model";
import util from "util";
import fs from "fs";
import fileType from "file-type";
import {File} from "formidable";


export const addGlobalAvatar = async (fileName: string, buffer: Buffer): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];
        const qc: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_GLOBAL_AVATAR WHERE NAME = ?`, [fileName]);
        if (qc[0].COUNT > 0) {
            errors.push(`Global avatar named ${fileName} already exists`);
        } else {
            const mimeType: fileType.FileTypeResult = await fileType.fromBuffer(buffer);
            const size = buffer.length;

            const q: QueryResponse = await conn.query(`INSERT INTO TBL_GLOBAL_AVATAR (NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?, ?, ?, ?)`,
                [fileName, mimeType.mime, size, buffer]);
            if (q.affectedRows <= 0) {
                errors.push(`Failed to insert global avatar named ${fileName}`);
            };
        }
        return errors;
    });
};

export const addGlobalImage = async (fileName: string, tag: string, buffer: Buffer): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];
        const q1: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_GLOBAL_IMAGE WHERE NAME=? OR TAG=?`, [fileName, tag]);
        if (q1[0].COUNT > 0) {
            errors.push(`Global image with name ${fileName} or tag ${tag} already exists`);
        } else {
            const mimeType: fileType.FileTypeResult = await fileType.fromBuffer(buffer);
            const size = buffer.length;

            const q: QueryResponse = await conn.query(`INSERT INTO TBL_GLOBAL_IMAGE (NAME, MIME_TYPE, SIZE, CONTENT, TAG) VALUES (?,?,?,?,?)`, [fileName, mimeType.mime, size, buffer, tag]);
            if (q.affectedRows <= 0) {
                errors.push(`Failed to insert global image ${fileName}`);
            }
        }
        return errors;
    });
};


export const saveUserAvatar = async (userId: number, avatar: { globalAvatarName?: string, customAvatarFile?: File}): Promise<{userAvatarId: number, errors: string[]}> => {
    const errors: string[] = [];
    let userAvatarId: number;
    if (avatar.globalAvatarName && avatar.customAvatarFile) {
        errors.push(`globalAvatarName and customAvatarFile cannot be supplied together picked on`);
    } else if (avatar.globalAvatarName) {
        await doInDbConnection(async (conn: Connection) => {
            const q1: QueryA = await conn.query(`SELECT ID FROM TBL_GLOBAL_AVATAR WHERE NAME = ? `, [avatar.globalAvatarName]);
            if (q1.length > 0) {
                const globalAvatarId: number = q1[0].ID;
                const qCount: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT, ID FROM TBL_USER_AVATAR WHERE USER_ID = ? GROUP BY ID`, [userId]);
                let q: QueryResponse;
                let userAvatarId: number;
                if (qCount.length && qCount[0].COUNT > 0) {
                    q = await conn.query(`UPDATE TBL_USER_AVATAR SET GLOBAL_AVATAR_ID = ?, MIME_TYPE = ?, SIZE = ?, CONTENT =? WHERE USER_ID = ?`,
                        [globalAvatarId, null, null, null, userId]);
                    userAvatarId = qCount[0].ID;
                } else {
                    q = await conn.query(`INSERT INTO TBL_USER_AVATAR (USER_ID, GLOBAL_AVATAR_ID, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?) `,
                        [userId, globalAvatarId, null, null, null]);
                    userAvatarId = q.insertId;
                }
            } else {
                errors.push(`Global avatar name ${avatar.globalAvatarName} is not found`);
            }
        });
    } else if (avatar.customAvatarFile) {
        await doInDbConnection(async (conn: Connection) => {
            const name: string = avatar.customAvatarFile.name;
            const buffer: Buffer = Buffer.from(await util.promisify(fs.readFile)(avatar.customAvatarFile.path));
            const ft: fileType.FileTypeResult = await fileType.fromBuffer(buffer);
            const qCount: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT, ID FROM TBL_USER_AVATAR WHERE USER_ID = ? GROUP BY ID`, [userId]);
            let q: QueryResponse;
            if (qCount.length && qCount[0].COUNT > 0) {
                q = await conn.query(`UPDATE TBL_USER_AVATAR SET NAME=?, GLOBAL_AVATAR_ID = ?, MIME_TYPE = ?, SIZE = ?, CONTENT =? WHERE USER_ID = ?`,
                    [name, null, ft.mime, buffer.length, buffer, userId]);
                userAvatarId = qCount[0].ID;
                if (q.affectedRows <= 0) {
                    errors.push(`Failed to update user id ${userId} avatar`);
                }
            } else {
                q = await conn.query(`INSERT INTO TBL_USER_AVATAR (NAME, USER_ID, GLOBAL_AVATAR_ID, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?,?) `,
                    [name, userId, null, ft.mime, buffer.length, buffer]);
                userAvatarId = q.insertId;
                if (q.affectedRows <= 0) {
                    errors.push(`Failed to add user id ${userId} avatar`);
                }
            }
        });
    } else { // insufficient parameters
        errors.push(`globalAvatarName and customAvatarFile are both not given`);
    }
    return { userAvatarId, errors};
};

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