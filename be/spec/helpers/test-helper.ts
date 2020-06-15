import {doInDbConnection} from "../../src/db";
import {Connection} from "mariadb";
import config from "../../src/config";
import {runUpdate} from "../../src/updater";

const testDbName = `fuyuko-be-test`;
const testDbUser = `admin`;

export const JASMINE_TIMEOUT = 100000;

export const setupBeforeAll = (doneFn: DoneFn) => {
    setupTestDatabase();
    [
        recreateDatabase,
        setupTestData,
        doDone(doneFn)
    ].reduce((p: Promise<any>, f: Function) => {
        return p.then(() => f());
    }, Promise.resolve());
};

export const doDone = (doneFn: DoneFn) => {
    return () => {
        return new Promise((res, rej) => {
            doneFn();
            res();
        });
    }
}

export const setupTestDatabase = () => {
    config['db-database'] = testDbName;
    config['db-user'] = testDbUser;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
};

export const recreateDatabase = async () => {
    setupTestDatabase();
    await doInDbConnection(async (conn: Connection) => {
        await conn.query(`DROP DATABASE IF EXISTS \`${testDbName}\``);
        await conn.query(`CREATE DATABASE IF NOT EXISTS \`${testDbName}\``);
    });
};

export const setupTestData = async () => {
    setupTestDatabase();
    await runUpdate();
};