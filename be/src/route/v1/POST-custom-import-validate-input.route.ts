import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { param, body } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT, ROLE_VIEW} from "../../model/role.model";
import {validate} from "../../custom-import/custom-import-executor";
import {ImportScriptInputValue, ImportScriptValidateResult} from "../../model/custom-import.model";

const httpAction: any[] = [
    [
        param('customImportId').exists().isNumeric(),
        body('values').exists().isArray(),
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

        const v: ImportScriptValidateResult = await validate(customImportId, values);

        res.status(200).json(v);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/custom-import/:customImportId/validate-input`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);

};

export default reg;