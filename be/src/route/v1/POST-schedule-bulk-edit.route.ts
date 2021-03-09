import {Router, Request, Response, NextFunction} from 'express';
import {Registry} from '../../registry';
import {body, param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {BulkEditPackage} from '@fuyuko-common/model/bulk-edit.model';
import {bulkEditRunJob} from '../../service';
import {Job} from '@fuyuko-common/model/job.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


// CHECKED

const httpAction = [
    [
        param('viewId').exists().isNumeric(),
        body('bulkEditPackage').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const bulkEditPackage: BulkEditPackage = req.body.bulkEditPackage;

        const job: Job = await bulkEditRunJob(viewId, bulkEditPackage);

        res.status(200).json( {
            status: 'SUCCESS',
            message: `Bulk edit job scheduled`,
            payload: job
        } as ApiResponse<Job>);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/bulk-edit`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
