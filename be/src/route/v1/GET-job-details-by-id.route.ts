import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn, validateUserInAnyRoleMiddlewareFn} from "./common-middleware";
import {param} from 'express-validator';
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {Job, JobAndLogs, JobLog} from "../../model/job.model";
import {ROLE_VIEW} from "../../model/role.model";

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

const httpAction: any[] = [
    [
        param('jobId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    validateUserInAnyRoleMiddlewareFn([ROLE_VIEW]),
    async (req: Request, res: Response, next: NextFunction) => {
        const jobAndLogs: JobAndLogs = await doInDbConnection(async (conn: Connection) => {
            const jobId = req.params.jobId;
            const lastLogId = req.params.lastLogId;

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
        res.status(200).json(jobAndLogs);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p1 = `/job/:jobId/details/:lastLogId?`;
    const p2 = `/job/:jobId/details`;
    registry.addItem('GET', p1);
    registry.addItem('GET', p2);
    router.get(p1, ...httpAction);
    router.get(p2, ...httpAction);
}

export default reg;
