import {NextFunction, Request, Response, Router} from 'express';
import {Registry} from '../../registry';
import {param} from 'express-validator';
import {Status} from '@fuyuko-common/model/status.model';
import {updateWorkflowStatus} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

const httpAction: any[] = [
    [
        param('worflowId').exists().isNumeric(),
        param('status').exists().isString(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const workflowId = Number(req.params.workkflowId);
        const status: Status = req.params.status as Status;

        const errors = await updateWorkflowStatus(workflowId, status);

        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Update successful`
            } as ApiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/workflow/:workflowId/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;