import {Router, Request, Response, NextFunction} from "express";
import {Registry} from "../../registry";
import {body, param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {BulkEditPackage} from "../../model/bulk-edit.model";
import {runJob} from "../../service/job-do-bulk-edit.service";
import {Job} from "../../model/job.model";

const httpAction = [
    [
        param('viewId').exists().isNumeric(),
        body('bulkEditPackage').exists()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const bulkEditPackage: BulkEditPackage = req.body.bulkEditPackage;

        const job: Job = await runJob(viewId, bulkEditPackage);

        res.status(200).json(job);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/bulk-edit`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
