import {Registry} from '../../registry';
import {Router, Request, Response, NextFunction} from 'express';
import {param, body} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {Job} from '@fuyuko-common/model/job.model';
import {exportAttributeRunJob} from '../../service';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


// CHECKED

const httpAction: any[] = [
   [
       param('viewId').exists().isNumeric(),
       body('attributes').exists().isArray()
   ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req:Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const attributes: Attribute[] = req.body.attributes;

        const job: Job = await exportAttributeRunJob(viewId, attributes);
        const apiResponse: ApiResponse<Job> = {
            messages: [{
                status: 'SUCCESS',
                message: `Attribute data export job scheduled`,
            }],
            payload: job
        };
        res.status(200).json(apiResponse);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/attributes`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
