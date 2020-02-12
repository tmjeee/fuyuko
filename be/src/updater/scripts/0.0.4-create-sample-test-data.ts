import {i} from "../../logger";
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {sprintf} from "sprintf";
import * as Path from "path";
import util from "util";
import {readFile} from "fs";
import fileType from "file-type";
import {GROUP_ADMIN, GROUP_EDIT, GROUP_PARTNER, GROUP_VIEW} from "../../model/group.model";
import {hashedPassword} from "../../service";

export const update = async () => {
    i(`running scripts in ${__filename}`);

    await INSERT_DATA();

    i(`done running update on ${__filename}`);
};


const INSERT_DATA = async () => {
    await doInDbConnection(async (conn: Connection) => {

        // lookup group ids
        const viewGroupId: number = (await conn.query(`SELECT ID FROM TBL_GROUP WHERE NAME=?`, [GROUP_VIEW]) as QueryA)[0].ID;
        const editGroupId: number = (await conn.query(`SELECT ID FROM TBL_GROUP WHERE NAME=?`, [GROUP_EDIT]) as QueryA)[0].ID;
        const adminGroupId: number = (await conn.query(`SELECT ID FROM TBL_GROUP WHERE NAME=?`, [GROUP_ADMIN]) as QueryA)[0].ID;
        const partnerGroupId: number = (await conn.query(`SELECT ID FROM TBL_GROUP WHERE NAME=?`, [GROUP_PARTNER]) as QueryA)[0].ID;

        // views
        const v1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['Test View 1', 'Test View 1 Description', 'ENABLED']);
        const v2: QueryResponse = await conn.query('INSERT INTO TBL_VIEW (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['Test View 2', 'Test View 2 Description', 'ENABLED']);
        const v3: QueryResponse = await conn.query('INSERT INTO TBL_VIEW (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['Test View 3', 'Test View 3 Description', 'ENABLED']);

        // attributes
        // string
        const a1: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, 'ENABLED')`, [v1.insertId, 'string', 'string attribute', 'string attribute description']);
        // text
        const a2: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, 'ENABLED')`, [v1.insertId, 'text', 'text attribute', 'text attribute description']);
        // number
        const a3: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, 'ENABLED')`, [v1.insertId, 'number', 'number attribute', 'number attribute description']);
        const a3m1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a3.insertId, 'number metadata']);
        const a3m1e1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a3m1.insertId, 'format', '0.0']);
        // date
        const a4: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, 'ENABLED')`, [v1.insertId, 'date', 'date attribute', 'date attribute description']);
        const a4m1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a4.insertId, 'date metadata']);
        const a4m1e1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a4m1.insertId, 'format', 'DD-MM-YYYY']);
        // currency
        const a5: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, 'ENABLED')`, [v1.insertId, 'currency', 'currency attribute', 'currency attribute description']);
        const a5m1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a5.insertId, 'currency metadata']);
        const a5m1e1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a5m1.insertId, 'showCurrencyCountry', 'true']);
        // volumne
        const a6: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, 'ENABLED')`, [v1.insertId, 'volume', 'volume attribute', 'volume attribute description']);
        const a6m1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a6.insertId, 'number metadata']);
        const a6m1e1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a6m1.insertId, 'format', '0.0']);
        // dimension
        const a7: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, 'ENABLED')`, [v1.insertId, 'dimension', 'dimension attribute', 'dimension attribute description']);
        const a7m1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a7.insertId, 'number metadata']);
        const a7m1e1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a7m1.insertId, 'format', '0.0']);
        // area
        const a8: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, 'ENABLED')`, [v1.insertId, 'area', 'area attribute', 'area attribute description']);
        const a8m1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a8.insertId, 'number metadata']);
        const a8m1e1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a8m1.insertId, 'format', '0.0']);
        // length
        const a9: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, 'ENABLED')`, [v1.insertId, 'length', 'length attribute', 'length attribute description']);
        const a9m1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a9.insertId, 'number metadata']);
        const a9m1e1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a9m1.insertId, 'format', '0.0']);
        // width
        const a10: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, 'ENABLED')`, [v1.insertId, 'width', 'width attribute', 'width attribute description']);
        const a10m1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a10.insertId, 'number metadata']);
        const a10m1e1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a10m1.insertId, 'format', '0.0']);
        // height
        const a11: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, 'ENABLED')`, [v1.insertId, 'height', 'height attribute', 'height attribute description']);
        const a11m1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a11.insertId, 'number metadata']);
        const a11m1e1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a11m1.insertId, 'format', '0.0']);
        // select
        const a12: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?,'ENABLED')`, [v1.insertId, 'select', 'select attribute', 'select attribute description']);
        const a12m1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a12.insertId, 'pair1']);
        const a12m1e1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key1', 'value1']);
        const a12m1e2: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key2', 'value2']);
        const a12m1e3: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key3', 'value3']);
        const a12m1e4: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key4', 'value4']);
        const a12m1e5: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key5', 'value5']);
        const a12m1e6: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key6', 'value6']);
        const a12m1e7: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key7', 'value7']);
        const a12m1e8: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key8', 'value8']);
        const a12m1e9: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a12m1.insertId, 'key9', 'value9']);
        // double select
        const a13: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, 'ENABLED')`, [v1.insertId, 'doubleselect', 'doubleselect attribute', 'doubleselect attribute description']);
        const a13m1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a13.insertId, 'pair1']);
        const a13m1e1: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key1', 'value1']);
        const a13m1e2: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key2', 'value2']);
        const a13m1e3: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key3', 'value3']);
        const a13m1e4: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key4', 'value4']);
        const a13m1e5: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key5', 'value5']);
        const a13m1e6: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key6', 'value6']);
        const a13m1e7: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key7', 'value7']);
        const a13m1e8: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key8', 'value8']);
        const a13m1e9: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m1.insertId, 'key9', 'value9']);
        const a13m2: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?, ?)', [a13.insertId, 'pair2']);
        const a13m2e11: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key1', 'xkey11=xvalue11']);
        const a13m2e12: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key1', 'xkey12=xvalue12']);
        const a13m2e13: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key1', 'xkey13=xvalue13']);
        const a13m2e14: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key1', 'xkey14=xvalue14']);
        const a13m2e15: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key1', 'xkey15=xvalue15']);
        const a13m2e16: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key1', 'xkey16=xvalue16']);
        const a13m2e17: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key1', 'xkey17=xvalue17']);
        const a13m2e18: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key1', 'xkey18=xvalue18']);
        const a13m2e19: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key1', 'xkey19=xvalue19']);
        const a13m2e21: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key2', 'xkey21=xvalue21']);
        const a13m2e22: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key2', 'xkey22=xvalue22']);
        const a13m2e23: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key2', 'xkey23=xvalue23']);
        const a13m2e24: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key2', 'xkey24=xvalue24']);
        const a13m2e25: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key2', 'xkey25=xvalue25']);
        const a13m2e26: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key2', 'xkey26=xvalue26']);
        const a13m2e27: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key2', 'xkey27=xvalue27']);
        const a13m2e28: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key2', 'xkey28=xvalue28']);
        const a13m2e29: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key2', 'xkey29=xvalue29']);
        const a13m2e31: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key3', 'xkey31=xvalue31']);
        const a13m2e32: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key3', 'xkey32=xvalue32']);
        const a13m2e33: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key3', 'xkey33=xvalue33']);
        const a13m2e34: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key3', 'xkey34=xvalue34']);
        const a13m2e35: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key3', 'xkey35=xvalue35']);
        const a13m2e36: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key3', 'xkey36=xvalue36']);
        const a13m2e37: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key3', 'xkey37=xvalue37']);
        const a13m2e38: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key3', 'xkey38=xvalue38']);
        const a13m2e39: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key3', 'xkey39=xvalue39']);
        const a13m2e41: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key4', 'xkey41=xvalue41']);
        const a13m2e42: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key4', 'xkey42=xvalue42']);
        const a13m2e43: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key4', 'xkey43=xvalue43']);
        const a13m2e44: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key4', 'xkey44=xvalue44']);
        const a13m2e45: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key4', 'xkey45=xvalue45']);
        const a13m2e46: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key4', 'xkey46=xvalue46']);
        const a13m2e47: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key4', 'xkey47=xvalue47']);
        const a13m2e48: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key4', 'xkey48=xvalue48']);
        const a13m2e49: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key4', 'xkey49=xvalue49']);
        const a13m2e51: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key5', 'xkey51=xvalue51']);
        const a13m2e52: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key5', 'xkey52=xvalue52']);
        const a13m2e53: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key5', 'xkey53=xvalue53']);
        const a13m2e54: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key5', 'xkey54=xvalue54']);
        const a13m2e55: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key5', 'xkey55=xvalue55']);
        const a13m2e56: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key5', 'xkey56=xvalue56']);
        const a13m2e57: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key5', 'xkey57=xvalue57']);
        const a13m2e58: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key5', 'xkey58=xvalue58']);
        const a13m2e59: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key5', 'xkey59=xvalue59']);
        const a13m2e61: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key6', 'xkey61=xvalue61']);
        const a13m2e62: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key6', 'xkey62=xvalue62']);
        const a13m2e63: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key6', 'xkey63=xvalue63']);
        const a13m2e64: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key6', 'xkey64=xvalue64']);
        const a13m2e65: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key6', 'xkey65=xvalue65']);
        const a13m2e66: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key6', 'xkey66=xvalue66']);
        const a13m2e67: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key6', 'xkey67=xvalue67']);
        const a13m2e68: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key6', 'xkey68=xvalue68']);
        const a13m2e69: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key6', 'xkey69=xvalue69']);
        const a13m2e71: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key7', 'xkey71=xvalue71']);
        const a13m2e72: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key7', 'xkey72=xvalue72']);
        const a13m2e73: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key7', 'xkey73=xvalue73']);
        const a13m2e74: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key7', 'xkey74=xvalue74']);
        const a13m2e75: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key7', 'xkey75=xvalue75']);
        const a13m2e76: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key7', 'xkey76=xvalue76']);
        const a13m2e77: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key7', 'xkey77=xvalue77']);
        const a13m2e78: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key7', 'xkey78=xvalue78']);
        const a13m2e79: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key7', 'xkey79=xvalue79']);
        const a13m2e81: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key8', 'xkey81=xvalue81']);
        const a13m2e82: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key8', 'xkey82=xvalue82']);
        const a13m2e83: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key8', 'xkey83=xvalue83']);
        const a13m2e84: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key8', 'xkey84=xvalue84']);
        const a13m2e85: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key8', 'xkey85=xvalue85']);
        const a13m2e86: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key8', 'xkey86=xvalue86']);
        const a13m2e87: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key8', 'xkey87=xvalue87']);
        const a13m2e88: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key8', 'xkey88=xvalue88']);
        const a13m2e89: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key8', 'xkey89=xvalue89']);
        const a13m2e91: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key9', 'xkey91=xvalue91']);
        const a13m2e92: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key9', 'xkey92=xvalue92']);
        const a13m2e93: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key9', 'xkey93=xvalue93']);
        const a13m2e94: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key9', 'xkey94=xvalue94']);
        const a13m2e95: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key9', 'xkey95=xvalue95']);
        const a13m2e96: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key9', 'xkey96=xvalue96']);
        const a13m2e97: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key9', 'xkey97=xvalue97']);
        const a13m2e98: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key9', 'xkey98=xvalue98']);
        const a13m2e99: QueryResponse = await conn.query('INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, `KEY`, `VALUE`) VALUES (?, ?, ?)', [a13m2.insertId, 'key9', 'xkey99=xvalue99']);


        // pricing structure
        const ps1: QueryResponse = await conn.query(`INSERT INTO TBL_PRICING_STRUCTURE (VIEW_ID, NAME, DESCRIPTION, STATUS) VALUES (?,?,?, 'ENABLED')`, [v1.insertId, 'Pricing Structure #1', 'Pricing Structure #1 Description']);
        const ps2: QueryResponse = await conn.query(`INSERT INTO TBL_PRICING_STRUCTURE (VIEW_ID, NAME, DESCRIPTION, STATUS) VALUES (?,?,?, 'ENABLED')`, [v2.insertId, 'Pricing Structure #2', 'Pricing Structure #2 Description']);

        // pricing structure with groups
        await conn.query(`INSERT INTO TBL_LOOKUP_PRICING_STRUCTURE_GROUP (PRICING_STRUCTURE_ID, GROUP_ID) VALUES (?,?) `, [ps1.insertId, adminGroupId]);
        await conn.query(`INSERT INTO TBL_LOOKUP_PRICING_STRUCTURE_GROUP (PRICING_STRUCTURE_ID, GROUP_ID) VALUES (?,?) `, [ps1.insertId, viewGroupId]);
        await conn.query(`INSERT INTO TBL_LOOKUP_PRICING_STRUCTURE_GROUP (PRICING_STRUCTURE_ID, GROUP_ID) VALUES (?,?) `, [ps1.insertId, editGroupId]);
        await conn.query(`INSERT INTO TBL_LOOKUP_PRICING_STRUCTURE_GROUP (PRICING_STRUCTURE_ID, GROUP_ID) VALUES (?,?) `, [ps1.insertId, partnerGroupId]);
        await conn.query(`INSERT INTO TBL_LOOKUP_PRICING_STRUCTURE_GROUP (PRICING_STRUCTURE_ID, GROUP_ID) VALUES (?,?) `, [ps2.insertId, adminGroupId]);
        await conn.query(`INSERT INTO TBL_LOOKUP_PRICING_STRUCTURE_GROUP (PRICING_STRUCTURE_ID, GROUP_ID) VALUES (?,?) `, [ps2.insertId, viewGroupId]);
        await conn.query(`INSERT INTO TBL_LOOKUP_PRICING_STRUCTURE_GROUP (PRICING_STRUCTURE_ID, GROUP_ID) VALUES (?,?) `, [ps2.insertId, editGroupId]);
        await conn.query(`INSERT INTO TBL_LOOKUP_PRICING_STRUCTURE_GROUP (PRICING_STRUCTURE_ID, GROUP_ID) VALUES (?,?) `, [ps2.insertId, partnerGroupId]);

        // items
        await createManyItems(conn, ps1.insertId, v1.insertId, a1.insertId, a2.insertId, a3.insertId, a4.insertId, a5.insertId, a6.insertId, a7.insertId, a8.insertId, a9.insertId, a10.insertId, a11.insertId, a12.insertId, a13.insertId);

        // rules
        await createManyRules(conn, v1.insertId, a1.insertId, a2.insertId);

        // invitation registrations
        for (let i = 1; i < 100; i++) {
            const q: QueryResponse = await conn.query(`INSERT INTO TBL_INVITATION_REGISTRATION (EMAIL, CODE, ACTIVATED) VALUES (?,?,?)`, [`invitation${i}@gmail.com`, `code${i}`, false]);
            await conn.query('INSERT INTO TBL_INVITATION_REGISTRATION_GROUP (INVITATION_REGISTRATION_ID, GROUP_ID) VALUES (?,?)', [q.insertId, 1]);
            await conn.query('INSERT INTO TBL_INVITATION_REGISTRATION_GROUP (INVITATION_REGISTRATION_ID, GROUP_ID) VALUES (?,?)', [q.insertId, 4]);
        }

        // self-registrations
        for (let i = 1; i < 100; i++) {
            const q: QueryResponse = await conn.query(`INSERT INTO TBL_SELF_REGISTRATION (USERNAME, EMAIL, FIRSTNAME, LASTNAME, PASSWORD, ACTIVATED) VALUES (?,?,?,?,?,?)`, [`self${i}`,`self${i}@gmail.com`,`self${i}-firstname`,`self${i}-lastname`, hashedPassword(`test`),false]);
        }
    });
}

type CreateRuleType = {
    name: string,
    viewId: number,
    validateClauses: {
        attributeId: number,
        operator: string,
        metadatas: {
            entries: {
                key: string,
                value: string,
                dataType: string
            }[]
        }[]
    }[],
    whenClauses: {
        attributeId: number,
        operator: string,
        metadatas: {
            entries: {
                key: string,
                value: string,
                dataType: string
            }[]
        }[]
    }[]
}

const createManyRules = async(conn: Connection, viewId: number, att1Id: number, att2Id: number) => {
    let counter = 1;
    const c = ()=>({
        name: `Rule #${counter++}`,
        viewId: viewId,
        validateClauses: [
            {
                attributeId: att1Id,
                operator: 'eq',
                metadatas: [
                    {
                        entries:[
                            { key: 'type', value: 'string', dataType: 'string'},
                            { key: 'value', value: 'val string 1', dataType: 'string'},
                        ]
                    },
                    {
                        entries:[
                            { key: 'type', value: 'string', dataType: 'string'},
                            { key: 'value', value: 'val string 2', dataType: 'string'},
                        ]
                    },
                ]
            }
        ],
        whenClauses: [
            {
                attributeId: att2Id,
                operator: 'not eq',
                metadatas: [
                    {
                        entries:[
                            { key: 'type', value: 'text', dataType: 'string'},
                            { key: 'value', value: 'val text 1', dataType: 'string'},
                        ]
                    },
                    {
                        entries:[
                            { key: 'type', value: 'text', dataType: 'string'},
                            { key: 'value', value: 'val text 2', dataType: 'string'},
                        ]
                    },
                ]
            },
        ]
    });

    await createRule(conn, c());
    await createRule(conn, c());
    await createRule(conn, c());
    await createRule(conn, c());
    await createRule(conn, c());
    await createRule(conn, c());
}

const createRule = async (conn: Connection, t: CreateRuleType) => {
    const r1: QueryResponse = await conn.query(`INSERT INTO TBL_RULE (VIEW_ID, NAME, DESCRIPTION, STATUS) VALUES (?,?,?,'ENABLED')`, [t.viewId, t.name, `${t.name} Description`]);
    for (const vc of t.validateClauses) {
        const vc1: QueryResponse = await conn.query(`INSERT INTO TBL_RULE_VALIDATE_CLAUSE (RULE_ID, VIEW_ATTRIBUTE_ID, \`OPERATOR\`, \`CONDITION\`) VALUES (?,?,?,?)`, [r1.insertId, vc.attributeId, vc.operator, '']);
        for (const vcm of vc.metadatas) {
            const vcm1: QueryResponse = await conn.query(`INSERT INTO TBL_RULE_VALIDATE_CLAUSE_METADATA (RULE_VALIDATE_CLAUSE_ID, NAME) VALUES (?, '')`, [vc1.insertId]);
            for (const vcme of vcm.entries) {
                await conn.query(`INSERT INTO TBL_RULE_VALIDATE_CLAUSE_METADATA_ENTRY (RULE_VALIDATE_CLAUSE_METADATA_ID, \`KEY\`, \`VALUE\`, DATA_TYPE) VALUES (?,?,?,?)`, [vcm1.insertId, vcme.key, vcme.value, vcme.dataType]);
            }
        }
    }

    for (const wc of t.whenClauses) {
        const wc1: QueryResponse = await conn.query(`INSERT INTO TBL_RULE_WHEN_CLAUSE (RULE_ID, VIEW_ATTRIBUTE_ID, \`OPERATOR\`, \`CONDITION\`) VALUES (?,?,?,?)`, [r1.insertId, wc.attributeId, wc.operator, '']);
        for (const wcm of wc.metadatas) {
            const wcm1: QueryResponse = await conn.query(`INSERT INTO TBL_RULE_WHEN_CLAUSE_METADATA (RULE_WHEN_CLAUSE_ID, NAME) VALUES (?, '')`, [wc1.insertId]);
            for (const wcme of wcm.entries) {
                await conn.query(`INSERT INTO TBL_RULE_WHEN_CLAUSE_METADATA_ENTRY (RULE_WHEN_CLAUSE_METADATA_ID, \`KEY\`, \`VALUE\`, DATA_TYPE) VALUES (?,?,?,?)`, [wcm1.insertId, wcme.key, wcme.value, wcme.dataType]);
            }
        }
    }
}

type CreateItemType = {
    viewId: number,
    itemName: string,
    images: {
        fileName: string,
        primary: boolean
    }[],
    values: {
        attributeId: number,
        metadatas:
            {
                entries: {
                    key: string;
                    value: string;
                    dataType: string;
                }[]
            }[]
    }[],
    children: CreateItemType[]
}

const createManyItems = async (conn: Connection, pricingStructureId: number, viewId: number, att1Id: number, att2Id: number, att3Id: number, att4Id: number, att5Id: number, att6Id: number,
                               att7Id: number, att8Id: number, att9Id: number, att10Id: number, att11Id: number, att12Id: number, att13Id: number) => {
    let _c = 0;
    const c = () => {
        return (((_c++)%351)+1);
    }
    const createAnItemType = (itemName: string, children: CreateItemType[] = []): CreateItemType => ({
        viewId: viewId,
        itemName: itemName,
        images: [
            { fileName: sprintf('%04s.jpg', c()), primary: true },
            { fileName: sprintf('%04s.jpg', c()), primary: false },
            { fileName: sprintf('%04s.jpg', c()), primary: false },
        ],
        children,
        values: [
            {attributeId: att1Id, // string
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'string', dataType: 'string'},
                        { key: 'value', value: `some string ${random()}`, dataType: 'string'}
                    ]}]},
            {attributeId: att2Id, // text
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'text', dataType: 'string'},
                        { key: 'value', value: `some text ${random()}`, dataType: 'string'}
                    ]}]},
            {attributeId: att3Id, // number
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'number', dataType: 'string'},
                        { key: 'value', value: `${random()}`, dataType: 'number'}
                    ]}]},
            {attributeId: att4Id, // date
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'date', dataType: 'string'},
                        { key: 'value', value: `12-10-1988`, dataType: 'string'}
                    ]}]},
            {attributeId: att5Id, // currency
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'currency', dataType: 'string'},
                        { key: 'value', value: `${random()}.10`, dataType: 'number'},
                        { key: 'country', value: 'AUD', dataType: 'string'}
                    ]}]},
            {attributeId: att6Id, // volume
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'volume', dataType: 'string'},
                        { key: 'value', value: `${random()}`, dataType: 'number'},
                        { key: 'unit', value: 'l', dataType: 'string'}
                    ]}]},
            {attributeId: att7Id, // dimension
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'dimension', dataType: 'string'},
                        { key: 'length', value: `${random()}`, dataType: 'number'},
                        { key: 'width', value: `${random()}`, dataType: 'number'},
                        { key: 'height', value: `${random()}`, dataType: 'number'},
                        { key: 'unit', value: 'cm', dataType: 'string'}
                    ]}]},
            {attributeId: att8Id, // area
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'area', dataType: 'string'},
                        { key: 'value', value: `${random()}`, dataType: 'number'},
                        { key: 'unit', value: 'cm', dataType: 'string'}
                    ]}]},
            {attributeId: att9Id, // length
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'length', dataType: 'string'},
                        { key: 'value', value: `${random()}`, dataType: 'number'},
                        { key: 'unit', value: 'cm', dataType: 'string'}
                    ]}]},
            {attributeId: att10Id, // width
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'width', dataType: 'string'},
                        { key: 'value', value: `${random()}`, dataType: 'number'},
                        { key: 'unit', value: 'cm', dataType: 'string'}
                    ]}]},
            {attributeId: att11Id, // height
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'height', dataType: 'string'},
                        { key: 'value', value: `${random()}`, dataType: 'number'},
                        { key: 'unit', value: 'cm', dataType: 'string'}
                    ]}]},
            {attributeId: att12Id, // select
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'select', dataType: 'string'},
                        { key: 'key', value: 'key2', dataType: 'string'},
                    ]}]},
            {attributeId: att13Id, // doubleselect
                metadatas: [{
                    entries: [
                        { key: 'type', value: 'doubleselect', dataType: 'string'},
                        { key: 'key1', value: 'key3', dataType: 'string'},
                        { key: 'key2', value: 'xkey35', dataType: 'string'},
                    ]}]},
        ]
    });

    /*
    const itemDef: CreateItemType =
        createAnItemType([
            createAnItemType([
                createAnItemType([
                    createAnItemType()
                ]),
                createAnItemType([
                    createAnItemType([
                        createAnItemType()
                    ])
                ]),
                createAnItemType()
            ]),
            createAnItemType(),
        ]);
     */

    const itemDef1: CreateItemType =
        createAnItemType(`Item-1`, [
            createAnItemType(`Item-1-1`),
            createAnItemType(`Item-1-2`)
        ]);
    const itemDef2: CreateItemType =
        createAnItemType(`Item-2`);
    const itemDef3: CreateItemType =
        createAnItemType(`Item-3`);
    const itemDef4: CreateItemType =
        createAnItemType(`Item-4`);
    const itemDef5: CreateItemType =
        createAnItemType(`Item-5`);
    const itemDef6: CreateItemType =
        createAnItemType(`Item-6`);
    const itemDef7: CreateItemType =
        createAnItemType(`Item-7`);

    await _createItem(conn, pricingStructureId, itemDef1);
    await _createItem(conn, pricingStructureId, itemDef2);
    await _createItem(conn, pricingStructureId, itemDef3);
    await _createItem(conn, pricingStructureId, itemDef4);
    await _createItem(conn, pricingStructureId, itemDef5);
    await _createItem(conn, pricingStructureId, itemDef6);
    await _createItem(conn, pricingStructureId, itemDef7);
}

const _createItem = async (conn: Connection, pricingStructureId: number, args: CreateItemType, parentItemId: number = null) => {
    // item
    const qItem: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM (PARENT_ID, VIEW_ID, NAME, DESCRIPTION, STATUS) VALUES (?,?,?,?,'ENABLED')`, [parentItemId, args.viewId, args.itemName, `${args.itemName} Description`]);
    const itemId: number = qItem.insertId;

    await conn.query(`INSERT INTO TBL_PRICING_STRUCTURE_ITEM (ITEM_ID, PRICING_STRUCTURE_ID, COUNTRY, PRICE) VALUES (?,?,?,?) `, [qItem.insertId, pricingStructureId, 'AUD', Number((Math.random() * 10 + 1).toFixed(2))]);

    for (const attr of args.values) {
        const qItemValue: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE (ITEM_ID, VIEW_ATTRIBUTE_ID) VALUES (?,?)`, [itemId, attr.attributeId]);
        const itemValueId: number = qItemValue.insertId;

        for (const metadata of attr.metadatas) {
            const qItemValueMetadata: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE_METADATA (ITEM_VALUE_ID, NAME) VALUES (?,?)`, [itemValueId, '']);
            const itemValueMetadataId: number = qItemValueMetadata.insertId;

            for (const entry of metadata.entries) {
                await conn.query(`INSERT INTO TBL_ITEM_VALUE_METADATA_ENTRY (ITEM_VALUE_METADATA_ID, \`KEY\`, \`VALUE\`, DATA_TYPE) VALUES (?,?,?,?)`, [itemValueMetadataId, entry.key, entry.value, entry.dataType]);
            }
        }
    }
    for (const image of args.images) {
        const fileName = image.fileName;
        const isPrimary = image.primary;
        const fullPath = Path.resolve(__dirname, '../assets/item-images', fileName);

        const buffer: Buffer = await util.promisify(readFile)(fullPath);
        const mimeType: fileType.FileTypeResult = fileType(buffer);

        await conn.query(`INSERT INTO TBL_ITEM_IMAGE (ITEM_ID, \`PRIMARY\`, MIME_TYPE, NAME, SIZE, CONTENT) VALUES (?,?,?,?,?,?)`, [itemId, isPrimary, mimeType.mime, fileName, buffer.length, buffer]);
    }


    for (const child of args.children) {
        await _createItem(conn, pricingStructureId, child, itemId);
    }
}


const random = (): string => {
    return String(Math.round(Math.random() * 100000));
}
