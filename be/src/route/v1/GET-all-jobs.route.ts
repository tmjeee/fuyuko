import {Router, Request, Response, NextFunction} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {Job} from '@fuyuko-common/model/job.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getAllJobs} from '../../service';

// CHECKED
const httpAction: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const jobs: Job[] = await getAllJobs();

        const apiResponse: ApiResponse<Job[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Jobs retrieved successfully`,
            }],
            payload: jobs
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/jobs`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
