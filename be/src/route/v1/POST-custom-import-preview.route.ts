import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import { param, body } from "express-validator";
import {ImportScriptInputValue, ImportScriptPreview} from "../../model/custom-import.model";
import {preview} from "../../custom-import/custom-import-executor";
import {ROLE_EDIT, ROLE_VIEW} from "../../model/role.model";


const httpAction: any[] = [
    [
        param('customImportId').exists().isNumeric(),
        body('values').isArray(),
        body('values.*.type').exists().isString(),
        body('values.*.name').exists().isString(),
        body('values.*.value'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const customImportId: number = Number(req.params.customImportId);
        const values: ImportScriptInputValue[] = req.body.values;

        const p: ImportScriptPreview = await preview(customImportId, values);
        res.status(200).json(p);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/custom-import/:customImportId/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);

};

export default reg;

