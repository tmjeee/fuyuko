import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {param} from 'express-validator';
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {Job, JobAndLogs, JobLog} from "../../model/job.model";
import {ROLE_VIEW} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";
import {getJobDetailsById, getJobyById} from "../../service/job.service";

// CHECKED

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
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const jobId = Number(req.params.jobId);
        const lastLogId = req.params.lastLogId ? Number(req.params.lastLogId) : null;
        const jobAndLogs: JobAndLogs = await getJobDetailsById(jobId, lastLogId);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Job and logs retrieved`,
            payload: jobAndLogs
        } as ApiResponse<JobAndLogs>);
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
