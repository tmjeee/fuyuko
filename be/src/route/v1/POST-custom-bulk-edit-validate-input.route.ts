import {NextFunction, Request, Response, Router} from "express";
import {Registry} from "../../registry";
import {body, param} from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";
import {CustomBulkEditScriptInputValue, CustomBulkEditScriptValidateResult} from "../../model/custom-bulk-edit.model";
import {validate} from "../../custom-bulk-edit/custom-bulk-edit-executor";

const httpAction: any[] = [

    [
        param('viewId').exists().isNumeric(),
        param('customBulkEditId').exists().isNumeric(),
        body('values').exists().isArray(),
        body('values.*.type').exists().isString(),
        body('values.*.name').exists().isString(),
        body('values.*.value'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const customBulkEditId: number = Number(req.params.customBulkEditId);
        const values: CustomBulkEditScriptInputValue[] = req.body.values;

        const r: CustomBulkEditScriptValidateResult = await validate(viewId, customBulkEditId, values);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Custom Bulk Edit script validation result ready`,
            payload: r
        } as ApiResponse<CustomBulkEditScriptValidateResult>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-bulk-edit/:customBulkEditId/validate-input`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;