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
        const gView: QueryResponse = await conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['VIEW Group', 'Group with VIEW role', 'ENABLED']);
        const gEdit: QueryResponse = await conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['EDIT Group', 'Group with EDIT role', 'ENABLED']);
        const gAdmin: QueryResponse = await conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['ADMIN Group', 'Group with ADMIN role', 'ENABLED']);
        const gPartner: QueryResponse = await conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['PARTNER Group', 'Group with PARTNER role', 'ENABLED']);

        // user-groups
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [ u1.insertId, gView.insertId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [ u1.insertId, gEdit.insertId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [ u1.insertId, gAdmin.insertId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [ u1.insertId, gPartner.insertId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [ u2.insertId, gView.insertId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [ u2.insertId, gEdit.insertId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [ u2.insertId, gAdmin.insertId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [ u2.insertId, gPartner.insertId]);

        // roles
        const rView: QueryResponse = await conn.query(`INSERT INTO TBL_ROLE (NAME, DESCRIPTION) VALUES (?, ?)`, ['VIEW', 'VIEW Role']);
        const rEdit: QueryResponse = await conn.query(`INSERT INTO TBL_ROLE (NAME, DESCRIPTION) VALUES (?, ?)`, ['EDIT', 'EDIT Role']);
        const rAdmin: QueryResponse = await conn.query(`INSERT INTO TBL_ROLE (NAME, DESCRIPTION) VALUES (?, ?)`, ['ADMIN', 'ADMIN Role']);
        const rPartner: QueryResponse = await conn.query(`INSERT INTO TBL_ROLE (NAME, DESCRIPTION) VALUES (?, ?)`, ['PARTNER', 'PARTNER Role']);

        // group-roles
        await conn.query(`INSERT INTO TBL_LOOKUP_GROUP_ROLE (GROUP_ID, ROLE_ID) VALUES (?,?)`, [gView.insertId, rView.insertId]);
        await conn.query(`INSERT INTO TBL_LOOKUP_GROUP_ROLE (GROUP_ID, ROLE_ID) VALUES (?,?)`, [gEdit.insertId, rEdit.insertId]);
        await conn.query(`INSERT INTO TBL_LOOKUP_GROUP_ROLE (GROUP_ID, ROLE_ID) VALUES (?,?)`, [gAdmin.insertId, rAdmin.insertId]);
        await conn.query(`INSERT INTO TBL_LOOKUP_GROUP_ROLE (GROUP_ID, ROLE_ID) VALUES (?,?)`, [gPartner.insertId, rPartner.insertId]);

        // user-theme
        await conn.query(`INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)`,[u1.insertId, 'pink_bluegrey_light']);
        await conn.query(`INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)`, [u2.insertId, 'indigo_lightblue_dark']);
    });
}




