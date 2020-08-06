import {doInDbConnection} from "../../src/db";
import {Connection} from "mariadb";
import config from "../../src/config";
import {runUpdate} from "../../src/updater";

const testDbName = `fuyuko-be-test`;
const testDbUser = `admin`;

export const JASMINE_TIMEOUT = 10000000;

export const setupBeforeAll2 = async () => {
    try {
        // await setupTestDatabase();
        await recreateDatabase();
        // await setupTestData();
    } catch(err) {
        console.error(err, err);
    }
};


export const doDone = (doneFn: DoneFn) => {
    return () => {
        return new Promise((res, rej) => {
            doneFn();
            res();
        }).catch((err) => {
            console.error(err.toString(), err);
        });
    }
}

export const setupTestDatabase = () => {
    console.log('***** setupTestDatabase');
    config['db-database'] = testDbName;
    config['db-user'] = testDbUser;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
};

export const recreateDatabase = async ()  => {
    console.log('***** recreatedatabase 1');
    await doInDbConnection(async (conn: Connection) => {
        config['db-database'] = testDbName;
        config['db-user'] = testDbUser;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        await setupTestDatabase();
        console.log('***** recreatedatabase 2');
        await conn.query(` SET FOREIGN_KEY_CHECKS = 0; `);
        await conn.query(` DROP DATABASE IF EXISTS \`${testDbName}\`;`);
        await conn.query(` CREATE DATABASE IF NOT EXISTS \`${testDbName}\`;`);
        await conn.query(` SET FOREIGN_KEY_CHECKS = 1; `);
    });
    await doInDbConnection(async (conn: Connection) => {
        console.log('***** recreatedatabase 3');
        config['db-database'] = testDbName;
        config['db-user'] = testDbUser;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        await setupTestDatabase();
        await conn.query(` SET FOREIGN_KEY_CHECKS = 0; `);
        await runUpdate();
        await conn.query(` SET FOREIGN_KEY_CHECKS = 1; `);
        console.log('***** recreatedatabase 4');
    });
};

export const setupTestData = async () => {
    await setupTestDatabase();
    await runUpdate();
};