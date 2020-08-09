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
import {Job} from "../../model/job.model";
import {getJobById} from "../../service/job.service";
import {ROLE_VIEW} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";

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

        res.status(200).json({
            status: 'SUCCESS',
            message: `Job successfully retrieved`,
            payload: job
        } as ApiResponse<Job>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/job/:jobId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
