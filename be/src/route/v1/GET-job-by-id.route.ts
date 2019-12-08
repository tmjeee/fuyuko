import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {param} from 'express-validator';
import {Job} from "../../model/job.model";
import {getJobyById} from "../../service/job.service";

const httpAction: any[] = [
    [
        param('jobId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const jobId: number = Number(req.params.jobId);

        const job: Job = await getJobyById(jobId);

        res.status(200).json(job);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/job/:jobId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;