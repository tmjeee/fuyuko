import {Pool, PoolConnection} from "mariadb";
import {i} from '../../logger';
import {doInDbConnection, QueryResponse} from '../../db';
import sha256 from "sha256";
import config from "../../config";
import {hashedPassword} from "../../service";

export const update = () => {
    i(`Inside ${__filename}, running update`);

    doInDbConnection(async (conn: PoolConnection) => {
        // users
        const u1: QueryResponse = await conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD) VALUES (?, ?, ?, ?, ?, ?)`,
            ['tmjee', new Date(), new Date(), 'tmjee1@gmail.com', 'ENABLED', hashedPassword('tmjee')]);
        const u2: QueryResponse = await conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD) VALUES (?, ?, ?, ?, ?, ?)`,
            ['sxjee', new Date(), new Date(), 'sxjee@gmail.com', 'ENABLED', hashedPassword('sxjee')]);

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
    });
};



