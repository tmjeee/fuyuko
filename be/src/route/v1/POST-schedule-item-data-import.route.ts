import {Job} from '@fuyuko-common/model/job.model';
import {importItemRunJob} from '../../service';
import {body, param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {NextFunction, Request, Response, Router} from 'express';
import {Registry} from '../../registry';
import {Item} from '@fuyuko-common/model/item.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('dataImportId').exists().isNumeric(),
        body('items').exists().isArray()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const dataImportId: number = Number(req.body.dataImportId);
        const items: Item[] =  req.body.items;

        const job: Job = await importItemRunJob(viewId, dataImportId, items);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Item data import job scheduled`,
            payload: job
        } as ApiResponse<Job>);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/items`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
