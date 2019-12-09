import {Job} from "../../model/job.model";
import {runJob} from "../../service/job-do-item-data-import.service";
import {PricingStructureItemWithPrice} from "../../model/pricing-structure.model";
import {body, param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {NextFunction, Request, Response, Router} from "express";
import {Registry} from "../../registry";
import {Item} from "../../model/item.model";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('dataImportId').exists().isNumeric(),
        body('items').exists().isArray()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const dataImportId: number = Number(req.body.dataImportId);
        const items: Item[] =  req.body.items;

        const job: Job = await runJob(viewId, dataImportId, items);

        res.status(200).json(job);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/items`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
