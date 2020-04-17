import {Job, JobAndLogs, JobLog} from "../model/job.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";
import {ApiResponse} from "../model/api-response.model";

const SQL = `
                SELECT 
                    J.ID AS J_ID,
                    J.NAME AS J_NAME,
                    J.DESCRIPTION AS J_DESCRIPTION,
                    J.CREATION_DATE AS J_CREATION_DATE,
                    J.LAST_UPDATE AS J_LAST_UPDATE,
                    J.STATUS AS J_STATUS,
                    J.PROGRESS AS J_PROGRESS,
                    
                    L.ID AS L_ID,
                    L.JOB_ID AS L_JOB_ID,
                    L.CREATION_DATE AS L_CREATION_DATE,
                    L.LAST_UPDATE AS L_LAST_UPDATE,
                    L.LEVEL AS L_LEVEL,
                    L.LOG AS L_LOG
                    
                FROM TBL_JOB AS J
                LEFT JOIN TBL_JOB_LOG AS L ON L.JOB_ID = J.ID
                WHERE J.ID=?
`;

const SQL_2 = `${SQL} AND L.ID > ?`


export const getJobDetailsById = async (jobId: number, lastLogId?: number): Promise<JobAndLogs> => {
    const jobAndLogs: JobAndLogs = await doInDbConnection(async (conn: Connection) => {

        const sql = (lastLogId) ? SQL_2 : SQL;
        const params = (lastLogId) ? [jobId, lastLogId] : [jobId];

        const q: QueryA = await conn.query(sql, params);

        const jobAndLogs: JobAndLogs = q.reduce((acc: JobAndLogs, i: QueryI) => {

            if (!acc.job) {
                acc.job = {
                    id: i.J_ID,
                    name: i.J_NAME,
                    description: i.J_DESCRIPTION,
                    status: i.J_STATUS,
                    creationDate: i.J_CREATION_DATE,
                    progress: i.J_PROGRESS,
                    lastUpdate: i.J_LAST_UPDATE
                } as Job
            }

            const log: JobLog = {
                id: i.L_ID,
                level: i.L_LEVEL,
                message: i.L_LOG,
                creationDate: i.L_CREATION_DATE,
                lastUpdate: i.L_LAST_UPDATE
            } as JobLog;
            acc.logs.push(log);

            return acc;
        }, { job: null, logs: []} as JobAndLogs);

        return jobAndLogs;
    });
    return jobAndLogs;
};

export const getAllJobs = async (): Promise<Job[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
                SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE, STATUS, PROGRESS FROM TBL_JOB ORDER BY ID DESC
            `, []);

        const jobs: Job[] = q.reduce((acc: Job[], i: QueryI) => {
            const j: Job = {
                id: i.ID,
                name: i.NAME,
                description: i.DESCRIPTION,
                creationDate: i.CREATION_DATE,
                lastUpdate: i.LAST_UPDATE,
                status: i.STATUS,
                progress: i.PROGRESS
            } as Job;
            acc.push(j);
            return acc;
        }, []);

        return jobs;
    });
};

export const getJobyById = async (jobId: number): Promise<Job> => {
    const job: Job = await doInDbConnection(async (conn: Connection) => {

        const q: QueryA = await conn.query(`
                SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE, STATUS, PROGRESS FROM TBL_JOB WHERE ID=? 
            `, [jobId]);

        return {
            id: q[0].ID,
            name: q[0].NAME,
            description: q[0].DESCRIPTION,
            creationDate: q[0].CREATION_DATE,
            lastUpdate: q[0].LAST_UPDATE,
            status: q[0].STATUS,
            progress: q[0].PROGRESS
        } as Job;
    });

    return job;
}