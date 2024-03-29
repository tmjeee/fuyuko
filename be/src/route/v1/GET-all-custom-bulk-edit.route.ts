import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {getAllCustomBulkEdits} from "../../service/custom-bulk-edit.service";
import {CustomBulkEdit} from '@fuyuko-common/model/custom-bulk-edit.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {CustomDataExport} from '@fuyuko-common/model/custom-export.model';
import {toHttpStatus} from "./aid.";

export const invocation = async (): Promise<ApiResponse<CustomBulkEdit[]>> => {
    const customBulkEdits: CustomBulkEdit[] = await getAllCustomBulkEdits();
    const apiResponse: ApiResponse<CustomBulkEdit[]> = {
        messages: [{
            status: 'SUCCESS',
            message: 'Custom Bulk Edit retrieval success',
        }],
        payload: customBulkEdits
    }
    return apiResponse;
}

const httpAction: any[] = [
    [
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const apiResponse = await invocation();
        res.status(toHttpStatus(apiResponse)).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/custom-bulk-edits`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
