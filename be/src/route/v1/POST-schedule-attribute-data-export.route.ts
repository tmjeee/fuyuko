import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {param, body} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {Attribute} from "../../model/attribute.model";
import {Job} from "../../model/job.model";
import {runJob} from "../../service/export-csv/job-do-attribute-data-export.service";

const httpAction: any[] = [
   [
       param('viewId').exists().isNumeric(),
       body('attributes').exists().isArray()
   ],
   validateJwtMiddlewareFn,
   validateMiddlewareFn,
    async (req:Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const attributes: Attribute[] = req.body.attributes;

        const job: Job = await runJob(viewId, attributes);
        res.status(200).json(job);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/attributes`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
