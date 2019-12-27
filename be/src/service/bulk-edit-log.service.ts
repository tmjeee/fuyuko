import {doInDbConnection, QueryA, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {Level} from "../model/level.model";

export class BulkEditLogger {

    constructor(private bulkEditId: number,
                private name: string,
                private description: string) {}

    async logDebug(log: string) {
        await this.log('DEBUG', log);
    }

    async logInfo(log: string) {
        await this.log('INFO', log);
    }

    async logWarn(log: string) {
        await this.log('WARN', log);
    }

    async logError(log: string) {
        await this.log('ERROR', log);
    }

    async log(level: Level , log: string) {
        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`INSERT INTO TBL_BULK_EDIT_LOG (BULK_EDIT_ID, LEVEL, LOG) VALUES (?,?,?)`, [this.bulkEditId, level, log]);
        });
    }
}


export const newBulkEditLogger = async (name: string, description: string = ''): Promise<BulkEditLogger> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryResponse = await conn.query(`INSERT INTO TBL_BULK_EDIT (NAME, DESCRIPTION) VALUES (?,?) `, [name, description]);
        const id: number  = q.insertId;

        return new BulkEditLogger(id, name, description);
    });
}
