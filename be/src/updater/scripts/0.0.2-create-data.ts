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

        // views
        const v1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['View 1', 'View 1 Description', 'ENABLED']);
        const v2: QueryResponse = await conn.query('INSERT INTO TBL_VIEW (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['View 2', 'View 2 Description', 'ENABLED']);
        const v3: QueryResponse = await conn.query('INSERT INTO TBL_VIEW (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['View 3', 'View 3 Description', 'ENABLED']);
        const v4: QueryResponse = await conn.query('INSERT INTO TBL_VIEW (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['View 4', 'View 4 Description', 'ENABLED']);
        const v5: QueryResponse = await conn.query('INSERT INTO TBL_VIEW (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['View 5', 'View 5 Description', 'ENABLED']);

        // attribute
        // string
        const a1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'string', 'string attribute', 'string attribute description']);
        // text
        const a2: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'text', 'text attribute', 'text attribute description']);
        // number
        const a3: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'number', 'number attribute', 'number attribute description']);
        const a3m1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a3.insertId, 'number metadata']);
        const a3m1e1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a3m1.insertId, 'format', '0.0']);
        // date
        const a4: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'date', 'date attribute', 'date attribute description']);
        const a4m1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a4.insertId, 'date metadata']);
        const a4m1e1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a4m1.insertId, 'format', 'DD-MM-YYYY']);
        // currency
        const a5: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'currency', 'currency attribute', 'currency attribute description']);
        const a5m1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a5.insertId, 'currency metadata']);
        const a5m1e1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a5m1.insertId, 'showCurrencyCountry', 'true']);
        // volumne
        const a6: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'volume', 'volume attribute', 'volume attribute description']);
        const a6m1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a6.insertId, 'number metadata']);
        const a6m1e1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a6m1.insertId, 'format', '0.0']);
        // dimention
        const a7: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'dimension', 'dimension attribute', 'dimension attribute description']);
        const a7m1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a7.insertId, 'number metadata']);
        const a7m1e1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a7m1.insertId, 'format', '0.0']);
        // area
        const a8: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'area', 'area attribute', 'area attribute description']);
        const a8m1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a8.insertId, 'number metadata']);
        const a8m1e1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a8m1.insertId, 'format', '0.0']);
        // length
        const a9: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'length', 'length attribute', 'length attribute description']);
        const a9m1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a9.insertId, 'number metadata']);
        const a9m1e1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a9m1.insertId, 'format', '0.0']);
        // width
        const a10: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'width', 'width attribute', 'width attribute description']);
        const a10m1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a10.insertId, 'number metadata']);
        const a10m1e1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a10m1.insertId, 'format', '0.0']);
        // height
        const a11: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'height', 'height attribute', 'height attribute description']);
        const a11m1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a11.insertId, 'number metadata']);
        const a11m1e1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a11m1.insertId, 'format', '0.0']);
        // select
        const a12: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'select', 'select attribute', 'select attribute description']);
        const a12m1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a12.insertId, 'select metadata']);
        const a12m1e1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key1', 'value1']);
        const a12m1e2: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key2', 'value2']);
        const a12m1e3: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key3', 'value3']);
        const a12m1e4: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key4', 'value4']);
        const a12m1e5: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key5', 'value5']);
        const a12m1e6: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key6', 'value6']);
        const a12m1e7: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key7', 'value7']);
        const a12m1e8: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key8', 'value8']);
        const a12m1e9: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key9', 'value9']);
        // double select
        const a13: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', [v1.insertId, 'doubleselect', 'doubleselect attribute', 'doubleselect attribute description']);
        const a13m1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a13.insertId, 'pair1']);
        const a13m1e1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key1', 'value1']);
        const a13m1e2: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key2', 'value2']);
        const a13m1e3: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key3', 'value3']);
        const a13m1e4: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key4', 'value4']);
        const a13m1e5: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key5', 'value5']);
        const a13m1e6: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key6', 'value6']);
        const a13m1e7: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key7', 'value7']);
        const a13m1e8: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key8', 'value8']);
        const a13m1e9: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key9', 'value9']);
        const a13m2: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a1.insertId, 'pair2']);
        const a13m2e1: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key1', 'xkey1=xvalue1']);
        const a13m2e2: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key2', 'xkey2=xvalue2']);
        const a13m2e3: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key3', 'xkey3=xvalue3']);
        const a13m2e4: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key4', 'xkey4=xvalue4']);
        const a13m2e5: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key5', 'xkey5=xvalue5']);
        const a13m2e6: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key6', 'xkey6=xvalue6']);
        const a13m2e7: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key7', 'xkey7=xvalue7']);
        const a13m2e8: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key8', 'xkey8=xvalue8']);
        const a13m2e9: QueryResponse = await conn.query('INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key9', 'xkey9=xvalue9']);
    });
}




