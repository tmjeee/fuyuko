import {Pool, PoolConnection} from "mariadb";
import {i} from '../../logger';
import {doInDbConnection, QueryResponse} from '../../db';
import sha256 from "sha256";
import config from "../../config";
import {hashedPassword} from "../../service";
import path from 'path';
import fs, {BinaryData, ReadStream} from 'fs';
import util, {promisify} from 'util';
import {fsRead, FsReadResult} from '../../util';
import fileType from 'file-type';


export const update = async () => {
    i(`Inside ${__filename}, running update`);

    await INSERT_DATA();
    await INSERT_GLOBAL_AVATARS();
};

const INSERT_GLOBAL_AVATARS = async () => {
    const avatarAssetsDir: string = path.resolve(__dirname, '../assets/avatars');
    const files: string[] = await util.promisify(fs.readdir)(avatarAssetsDir);

    for (const file of files) {
        const fullPath = `${avatarAssetsDir}${path.sep}${file}`;
        const buffer: Buffer = Buffer.from(await util.promisify(fs.readFile)(fullPath));
        const mimeType: fileType.FileTypeResult = fileType(buffer);
        const size = buffer.length;

        await doInDbConnection(async (conn: PoolConnection) => {
            const q: QueryResponse = await conn.query(`INSERT INTO TBL_GLOBAL_AVATAR (NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?, ?, ?, ?)`,
                [file, mimeType.mime, size, buffer]);
        });
    }
}

const INSERT_DATA = async () => {

    await doInDbConnection(async (conn: PoolConnection) => {
        // users
        const u1: QueryResponse = await conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD, FIRSTNAME, LASTNAME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['tmjee', new Date(), new Date(), 'tmjee1@gmail.com', 'ENABLED', hashedPassword('tmjee'), 'toby', 'jee']);
        const u2: QueryResponse = await conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD, FIRSTNAME, LASTNAME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['sxjee', new Date(), new Date(), 'sxjee@gmail.com', 'ENABLED', hashedPassword('sxjee'), 'jason', 'jee']);

        // groups
        const g1: QueryResponse = await conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['group 1', 'This is group 1', 'ENABLED']);
        const g2: QueryResponse = await conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['group 2', 'This is group 2', 'ENABLED']);
        const g3: QueryResponse = await conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['group 3', 'This is group 3', 'ENABLED']);
        const g4: QueryResponse = await conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['group 4', 'This is group 4', 'ENABLED']);

        // user-groups
        conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [ u1.insertId, g1.insertId]);
        conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [ u1.insertId, g2.insertId]);
        conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [ u2.insertId, g3.insertId]);
        conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [ u2.insertId, g4.insertId]);

        // user-theme
        conn.query(`INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)`,[u1.insertId, 'pink_bluegrey_light']);
        conn.query(`INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)`, [u2.insertId, 'indigo_lightblue_dark']);
    });
}




