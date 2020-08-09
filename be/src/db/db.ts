import {Connection, ConnectionConfig, createConnection} from 'mariadb';
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

export const doInDbConnection = async <R> (callback: (conn: Connection) => R)  => {
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
};

