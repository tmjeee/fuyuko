import {doInDbConnection} from "../../src/db";
import {Connection} from "mariadb";
import config from "../../src/config";

const testDbName = `fuyuko-be-test`;
const testDbUser = `admin`;

export const testBeforeAll = async () => {
    config['db-database'] = testDbName;
    config['db-user'] = testDbUser;
    await doInDbConnection(async (conn: Connection) => {
        await conn.query(`DROP DATABASE IF EXISTS \`${testDbName}\``);
        await conn.query(`CREATE DATABASE \`${testDbName}\``);
        // await runUpdate();
    });
};