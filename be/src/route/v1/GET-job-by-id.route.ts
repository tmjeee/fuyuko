import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {param} from 'express-validator';
import {Job} from '@fuyuko-common/model/job.model';
import {getJobById} from '../../service';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

// CHECKED
const httpAction: any[] = [
    [
        param('jobId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const jobId: number = Number(req.params.jobId);

        const job: Job = await getJobById(jobId);
        const apiResponse: ApiResponse<Job> = {
            messages: [{
                status: 'SUCCESS',
                message: `Job successfully retrieved`,
            }],
            payload: job
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/job/:jobId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
