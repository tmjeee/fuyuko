import {NextFunction, Request, Response, Router} from "express";
import {Registry} from "../../registry";
import {body, param} from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from "../../model/role.model";
import {ExportScriptInputValue, ExportScriptPreview} from "../../model/custom-export.model";
import {preview} from '../../../src/custom-export/custom-export-executor';

const httpAction: any[] = [
    [
        param('customExportId').exists().isNumeric(),
        param('viewId').exists().isNumeric(),
        body('values').isArray(),
        body('values.*.type').exists().isString(),
        body('values.*.name').exists().isString(),
        body('values.*.value'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const customExportId: number = Number(req.params.customExportId);
        const viewId: number = Number(req.params.viewId);
        const values: ExportScriptInputValue[] = req.body.values;

        const p: ExportScriptPreview = await preview(viewId, customExportId, values);
        res.status(200).json(p);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-export/:customExportId/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;