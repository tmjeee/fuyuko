import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {param, body} from 'express-validator';

import {Job} from "../../model/job.model";
import {Attribute} from "../../model/attribute.model";
import {runJob} from "../../service/job-do-attribute-data-import.service";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('dataImportId').exists().isNumeric(),
        body('attributes').exists().isArray()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const dataImportId: number = Number(req.body.dataImportId);
        const attributes: Attribute[] =  req.body.attributes;

        const job: Job = await runJob(viewId, dataImportId, attributes);

        res.status(200).json(job);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/attributes`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
