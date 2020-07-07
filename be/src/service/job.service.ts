import {Job, JobAndLogs, JobLog} from "../model/job.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";
import {fireEvent, GetAllJobsEvent, GetJobByIdEvent, GetJobDetailsByIdEvent} from "./event/event.service";

const J_SQL = `
                SELECT 
                    J.ID AS J_ID,
                    J.NAME AS J_NAME,
                    J.DESCRIPTION AS J_DESCRIPTION,
                    J.CREATION_DATE AS J_CREATION_DATE,
                    J.LAST_UPDATE AS J_LAST_UPDATE,
                    J.STATUS AS J_STATUS,
                    J.PROGRESS AS J_PROGRESS
                FROM TBL_JOB AS J
                WHERE J.ID = ?
`;

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



/**
 *  ================================
 *  === getJobDetailsById ===
 *  ================================
 */
export const getJobDetailsById = async (jobId: number, lastLogId?: number): Promise<JobAndLogs> => {
    const jobAndLogs: JobAndLogs = await doInDbConnection(async (conn: Connection) => {

        const sql = (lastLogId) ? SQL_2 : SQL;
        const params = (lastLogId) ? [jobId, lastLogId] : [jobId];

        const q: QueryA = await conn.query(sql, params);

        let jobAndLogs: JobAndLogs = null;
        if (q.length > 0) {
            jobAndLogs = q.reduce((acc: JobAndLogs, i: QueryI) => {

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
        } else {
            const q: QueryA = await conn.query(J_SQL, jobId);
            jobAndLogs = {
                job: q.length > 0 ? {
                    id: q[0].J_ID,
                    name: q[0].J_NAME,
                    description: q[0].J_DESCRIPTION,
                    status: q[0].J_STATUS,
                    creationDate: q[0].J_CREATION_DATE,
                    progress: q[0].J_PROGRESS,
                    lastUpdate: q[0].J_LAST_UPDATE
                } as Job : null,
                logs: []
            };
        }

        return jobAndLogs;
    });

    fireEvent({
       type: 'GetJobDetailsByIdEvent',
       jobId, lastLogId, jobAndLogs
    } as GetJobDetailsByIdEvent);

    return jobAndLogs;
};

/**
 * =======================
 * === getAllJobs ===
 * =======================
 */
export const getAllJobs = async (): Promise<Job[]> => {
    const jobs: Job[] = await doInDbConnection(async (conn: Connection) => {
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

    fireEvent({
       type: 'GetAllJobsEvent',
       jobs
    } as GetAllJobsEvent);

    return jobs;
};

/**
 *  ===================
 *  === getJobById ===
 *  ==================
 */
export const getJobById = async (jobId: number): Promise<Job> => {
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

    fireEvent({
       type: "GetJobByIdEvent",
       jobId, job
    } as GetJobByIdEvent);

    return job;
}