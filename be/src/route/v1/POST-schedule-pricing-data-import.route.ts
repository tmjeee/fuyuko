import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {param, body} from 'express-validator';

import {Job} from "../../model/job.model";
import {Attribute} from "../../model/attribute.model";
import {runJob} from "../../service/import-csv/job-do-price-data-import.service";
import {PricingStructureItemWithPrice} from "../../model/pricing-structure.model";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('dataImportId').exists().isNumeric(),
        body('pricingStructureItemsWithPrice').exists().isArray()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const dataImportId: number = Number(req.body.dataImportId);
        const pricingItems: PricingStructureItemWithPrice[] =  req.body.pricingStructureItemsWithPrice;

        const job: Job = await runJob(viewId, dataImportId, pricingItems);

        res.status(200).json(job);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/prices`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
