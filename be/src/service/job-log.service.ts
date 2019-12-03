import {doInDbConnection, QueryResponse} from "../db";
import {PoolConnection} from "mariadb";
import {Level} from "../model/level.model";
import {JobProgress} from "../model/job.model";

export class JobLogger {

    constructor(public jobId: number,
                private name: string,
                private description: string) {
    }

    async updateProgress(progress: JobProgress) {
        await doInDbConnection(async (conn: PoolConnection) => {
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
    async logError(log: string) {
        this.log('ERROR', log);
    }

    async log(level: Level, log: string) {
        await doInDbConnection(async (conn: PoolConnection) => {
            await conn.query(`INSERT INTO TBL_JOB_LOG (LEVEL, LOG) VALUES (?,?)`, [level, log]);
        });
    }
}


export const newJobLogger = async (name: string, description: string = ''): Promise<JobLogger> => {
    const q: QueryResponse = await doInDbConnection(async (conn: PoolConnection)=> {
        await conn.query(`INSERT INTO TBL_LOG (NAME, DESCRIPTION, STATUS, PROGRESS) VALUES (?,?,'ENABLED','SCHEDULED')`,
            [name, description]);
    });
    const id: number = q.insertId;
    return new JobLogger(id, name, description);
}
