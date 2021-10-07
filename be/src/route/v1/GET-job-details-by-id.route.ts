import {Registry} from '../../registry';
import {Router, Request, Response, NextFunction} from 'express';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {param} from 'express-validator';
import {JobAndLogs} from '@fuyuko-common/model/job.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getJobDetailsById} from '../../service';

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
        const lastLogId = req.params.lastLogId ? Number(req.params.lastLogId) : undefined;
        const jobAndLogs: JobAndLogs = await getJobDetailsById(jobId, lastLogId);
        const apiResponse: ApiResponse<JobAndLogs> = {
            messages: [{
                status: 'SUCCESS',
                message: `Job and logs retrieved`,
            }],
            payload: jobAndLogs
        };
        res.status(200).json(apiResponse);
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
