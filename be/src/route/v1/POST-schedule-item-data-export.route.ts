import {param, body} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {Registry} from '../../registry';
import {Router, Request, Response, NextFunction} from 'express';
import { Item } from '@fuyuko-common/model/item.model';
import {exportItemRunJob} from '../../service';
import {Job} from '@fuyuko-common/model/job.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('attributes').exists().isArray(),
        body('items').exists().isArray()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req:Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const attributes: Attribute[] = req.body.attributes;
        const item: Item[] = req.body.items;

        const job: Job = await exportItemRunJob(viewId, attributes, item);
        res.status(200).json( {
            status: 'SUCCESS',
            message: `Item data export job scheduled`,
            payload: job
        } as ApiResponse<Job>);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/items`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
