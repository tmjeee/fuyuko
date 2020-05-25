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
import {ItemDataImport} from "../../model/data-import.model";
import {preview} from "../../service/import-csv/import-item.service";
import {ROLE_EDIT} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED
const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const {fields, files} = await multipartParse(req);

        const r: {errors: string[], itemDataImport: ItemDataImport} = await preview(viewId, files.itemDataCsvFile);
        if (r.errors && r.errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: r.errors.join(', '),
                payload: r.itemDataImport
            } as ApiResponse<ItemDataImport>);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Item data import preview ready`,
                payload: r.itemDataImport
            } as ApiResponse<ItemDataImport>);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/items/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
