import {i} from "../../logger";
import path from "path";
import util from "util";
import fs from "fs";
import fileType from "file-type";
import {doInDbConnection, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {GROUP_ADMIN, GROUP_EDIT, GROUP_PARTNER, GROUP_VIEW} from "../../model/group.model";
import {UPDATER_PROFILE_CORE} from "../updater";

export const profiles = [UPDATER_PROFILE_CORE];

export const update = async () => {

    i(`running scripts in ${__filename}`);

    await INSERT_GLOBAL_AVATARS();
    await INSERT_GLOBAL_IMAGES();
    await INSERT_GROUPS_AND_ROLES();

    i(`done running update on ${__filename}`);
};

const INSERT_GROUPS_AND_ROLES = async () => {
    await doInDbConnection(async (conn: Connection) => {
        // groups
        const gView: QueryResponse = await conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', [GROUP_VIEW, 'Group with VIEW role', 'ENABLED']);
        const gEdit: QueryResponse = await conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', [GROUP_EDIT, 'Group with VIEW & EDIT role', 'ENABLED']);
        const gAdmin: QueryResponse = await conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', [GROUP_ADMIN, 'Group with VIEW & EDIT & PARTNER & ADMIN role', 'ENABLED']);
        const gPartner: QueryResponse = await conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', [GROUP_PARTNER, 'Group with PARTNER role', 'ENABLED']);

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
    });
}

const INSERT_GLOBAL_AVATARS = async () => {
    const avatarAssetsDir: string = path.resolve(__dirname, '../assets/avatars');
    const files: string[] = await util.promisify(fs.readdir)(avatarAssetsDir);

    for (const file of files) {
        const fullPath = `${avatarAssetsDir}${path.sep}${file}`;
        const buffer: Buffer = Buffer.from(await util.promisify(fs.readFile)(fullPath));
        const mimeType: fileType.FileTypeResult = fileType(buffer);
        const size = buffer.length;

        await doInDbConnection(async (conn: Connection) => {
            const q: QueryResponse = await conn.query(`INSERT INTO TBL_GLOBAL_AVATAR (NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?, ?, ?, ?)`,
                [file, mimeType.mime, size, buffer]);
        });
    }
};

const INSERT_GLOBAL_IMAGES = async () => {
    const globalImagesAssetsDir: string = path.resolve(__dirname, '../assets/global-images');
    const files: string[] = await util.promisify(fs.readdir)(globalImagesAssetsDir);

    for (const file of files) {
        const fullPath = `${globalImagesAssetsDir}${path.sep}${file}`;
        const fileNameOnly = path.basename(file).split('.')[0];
        const buffer: Buffer = Buffer.from(await util.promisify(fs.readFile)(fullPath));
        const mimeType: fileType.FileTypeResult = fileType(buffer);
        const size = buffer.length;

        await doInDbConnection(async (conn: Connection) => {
            const q: QueryResponse = await conn.query(`INSERT INTO TBL_GLOBAL_IMAGE (NAME, MIME_TYPE, SIZE, CONTENT, TAG) VALUES (?,?,?,?,?)`, [file, mimeType.mime, size, buffer, fileNameOnly]);
        });
    }
}

