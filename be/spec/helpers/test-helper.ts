import {doInDbConnection} from "../../src/db";
import {Connection} from "mariadb";
import config, {opts} from "../../src/config";
import {runUpdate} from "../../src/updater";

const testDbName = `fuyuko-be-test`;
const testDbUser = `admin`;

export const JASMINE_TIMEOUT = 10000000;

export const setupBeforeAll2 = async () => {
    try {
        await recreateDatabase();
    } catch(err) {
        console.error(err, err);
    }
};


export const doDone = (doneFn: DoneFn) => {
    return () => {
        return new Promise((res, rej) => {
            doneFn();
            res(null);
        }).catch((err) => {
            console.error(err.toString(), err);
        });
    }
}

export const setupTestDatabase = () => {
    config['db-database'] = testDbName;
    config['db-user'] = testDbUser;
    opts.test = true;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
};

export const recreateDatabase = async ()  => {
    await setupTestDatabase();
    await doInDbConnection(async (conn: Connection) => {
        await conn.query(` SET FOREIGN_KEY_CHECKS = 0; `);
        await conn.query(` DROP DATABASE IF EXISTS \`${testDbName}\`;`);
        await conn.query(` CREATE DATABASE IF NOT EXISTS \`${testDbName}\`;`);
        await runUpdate();
        await conn.query(` SET FOREIGN_KEY_CHECKS = 1; `);
    });
};

export const setupTestData = async () => {
    await setupTestDatabase();
    await runUpdate();
};