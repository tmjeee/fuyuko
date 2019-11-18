import * as mariadb  from 'mariadb';
import {Pool, PoolConfig, PoolConnection} from 'mariadb';
import config from '../config';
import {e} from '../logger';

const poolConfig: PoolConfig = {
    host: config["db-host"],
    user: config["db-user"],
    port: config["db-port"],
    password: config["db-password"],
    database: config["db-database"],
    connectionLimit: config["db-connection-limit"],
};

export const dbPool: Pool = mariadb.createPool(poolConfig);


export interface QueryM {
    meta: {
        columnLength: number,
        columnType: number,
        scale: number,
        type: string,
        flags: number,
        db: Function,
        schema: Function,
        table: Function,
        orgTable: Function,
        name: Function,
        orgName: Function
    }[],
}

export interface QueryI {
    [name: string]: any
}

// for SELECT statments
export type QueryA = QueryI[] & QueryM;


// for INSERT, UPDATE etc. statements
export type QueryResponse  = {
    affectedRows: number,
    insertId: number,
    warningStatus: number
};


export const doInDbConnection = async <R> (callback: (conn: PoolConnection) => R)  => {
    const conn: PoolConnection = await dbPool.getConnection();
    try {
        await conn.beginTransaction();
        const r: any =  await callback(conn);
        await conn.commit();
        return r;
    } catch(err) {
        await conn.rollback();
        // e(err.toString(), err);
        throw err;
        // return Promise.reject(e);
    } finally {
        await conn.end();
    }
};

