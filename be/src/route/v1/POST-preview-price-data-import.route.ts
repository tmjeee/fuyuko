import {Registry} from "../../registry";
import {NextFunction, Request, Response, Router} from "express";
import {param, body} from "express-validator";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {multipartParse} from "../../service";
import {File} from "formidable";
import {PriceDataImport} from "../../model/data-import.model";
import {preview} from "../../service/import-csv/import-price.service";
import {ROLE_EDIT} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";


// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        // body('priceDataCsvFile').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const {fields, files} = await multipartParse(req);
        const priceDataCsvFile: File = files.priceDataCsvFile;

        const r: {errors: string[], priceDataImport: PriceDataImport} = await preview(viewId, priceDataCsvFile);

        if (r.errors && r.errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: r.errors.join(', '),
                payload: r.priceDataImport
            } as ApiResponse<PriceDataImport>);

        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Price data import preview ready`,
                payload: r.priceDataImport
            } as ApiResponse<PriceDataImport>);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/prices/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
