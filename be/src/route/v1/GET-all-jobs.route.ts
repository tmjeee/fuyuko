import {Router, Request, Response, NextFunction} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {Job} from "../../model/job.model";
import {ROLE_VIEW} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";
import {getAllJobs} from "../../service/job.service";

// CHECKED
const httpAction: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const jobs: Job[] = await getAllJobs();

        res.status(200).json({
            status: 'SUCCESS',
            message: `Jobs retrieved successfully`,
            payload: jobs
        } as ApiResponse<Job[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/jobs`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
