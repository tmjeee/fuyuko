import {Job} from "../model/job.model";
import {doInDbConnection, QueryA} from "../db";
import {Connection} from "mariadb";

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