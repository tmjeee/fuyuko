import {Connection, ConnectionConfig, createConnection, createPool, Pool, PoolConfig, PoolConnection} from 'mariadb';
import config from '../config';

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
export type QueryA = (QueryI & QueryM)[];


// for INSERT, UPDATE etc. statements
export type QueryResponse  = {
    affectedRows: number,
    insertId: number,
    warningStatus: number
};


let pool: Pool;
export const reset = async () => {
    const poolConfig: PoolConfig = {
        connectionLimit: config["db-connection-limit"],
        connectTimeout: config["db-connection-timeout"],
        acquireTimeout: config["db-acquire-timeout"],
        host: config["db-host"],
        user: config["db-user"],
        port: config["db-port"],
        password: config["db-password"],
        database: config["db-database"],
    } as PoolConfig;
    pool &&  (await pool.end());
    pool = await createPool(poolConfig);
};

const getConn = async (): Promise<PoolConnection> => {
    if (!pool) {
        await reset();
    }
    return pool.getConnection();
};


export const doInDbConnection = async <R> (callback: (conn: Connection) => R)  => {
    const conn: PoolConnection = await getConn();
    try {
        conn.debug(false);
        conn.debugCompress(false);
        await conn.beginTransaction();
        const r: any =  await callback(conn);
        await conn.commit();
        return r;
    } catch(err) {
        await conn.rollback();
        throw err;
    } finally {
        await conn.release();
    }

    /*
    const connConfig: ConnectionConfig = {
        host: config["db-host"],
        user: config["db-user"],
        port: config["db-port"],
        password: config["db-password"],
        database: config["db-database"],
    } as ConnectionConfig;
    const conn: Connection = await createConnection(connConfig);
    try {
        conn.debug(false);
        conn.debugCompress(false);
        await conn.beginTransaction();
        const r: any =  await callback(conn);
        await conn.commit();
        return r;
    } catch(err) {
        await conn.rollback();
        throw err;
    } finally {
        await conn.end();
    }
    */

};

