import {doInDbConnection} from "../../src/db";
import {Connection} from "mariadb";

const testDbName = `fuyuko-be-test`;

export const testBeforeAll = async () => {
    // config['db-database'] = testDbName;
    await doInDbConnection(async (conn: Connection) => {
        await conn.query(`DROP DATABASE IF EXISTS \`${testDbName}\``);
        await conn.query(`CREATE DATABASE \`${testDbName}\``);
        // await runUpdate();
    });
};