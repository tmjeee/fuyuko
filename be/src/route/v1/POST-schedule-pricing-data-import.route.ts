import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {param, body} from 'express-validator';

import {Job} from "../../model/job.model";
import {runJob} from "../../service/import-csv/job-do-price-data-import.service";
import {PriceDataItem} from "../../model/pricing-structure.model";
import {ROLE_EDIT} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('dataImportId').exists().isNumeric(),
        body('priceDataItems').exists().isArray()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const dataImportId: number = Number(req.body.dataImportId);
        const priceDataItems: PriceDataItem[] =  req.body.priceDataItems;

        const job: Job = await runJob(viewId, dataImportId, priceDataItems);

        res.status(200).json ( {
            status: 'SUCCESS',
            message: `Pricing data import job scheduled`,
            payload: job
        } as ApiResponse<Job>);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/prices`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
