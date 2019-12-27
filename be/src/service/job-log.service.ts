import {doInDbConnection, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {Level} from "../model/level.model";
import {JobProgress} from "../model/job.model";
import {e} from '../logger';
import {l} from "../logger/logger";

export interface LoggingCallback  {
    (level: Level, msg: string): void;
}

export const newLoggingCallback = (jobLogger?: JobLogger) => {
    return (level: Level, msg: string) => {
        if (jobLogger) {
            jobLogger.log(level, msg);
        }
        l(level, msg);
    }
}

export class JobLogger {

    constructor(public jobId: number,
                private name: string,
                private description: string) {
    }

    async updateProgress(progress: JobProgress) {
        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`UPDATE TBL_JOB SET PROGRESS=? WHERE ID=?`, [progress, this.jobId]);
        });
    }

    async logDebug(log: string) {
        this.log('DEBUG', log);
    }
    async logInfo(log: string) {
        this.log('INFO', log);
    }
    async logWarn(log: string) {
        this.log('WARN', log);
    }
    async logError(log: string, err?: Error) {
        this.log('ERROR', log);
        e(`Error`, err);
    }

    async log(level: Level, log: string) {
        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`INSERT INTO TBL_JOB_LOG (JOB_ID, LEVEL, LOG) VALUES (?,?,?)`, [this.jobId, level, log]);
        });
    }
}


export const newJobLogger = async (name: string, description: string = ''): Promise<JobLogger> => {
    return await doInDbConnection(async (conn: Connection)=> {
        const q: QueryResponse = await conn.query(`INSERT INTO TBL_JOB (NAME, DESCRIPTION, STATUS, PROGRESS) VALUES (?,?,'ENABLED','SCHEDULED')`,
            [name, description]);
        const id: number = q.insertId;
        return new JobLogger(id, name, description);
    });
}
