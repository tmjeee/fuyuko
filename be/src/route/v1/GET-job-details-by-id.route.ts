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
