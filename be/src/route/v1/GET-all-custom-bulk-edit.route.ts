import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {getAllCustomBulkEdits} from "../../service/custom-bulk-edit.service";
import {CustomBulkEdit} from '@fuyuko-common/model/custom-bulk-edit.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {CustomDataExport} from '@fuyuko-common/model/custom-export.model';

const httpAction: any[] = [
    [
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const customBulkEdits: CustomBulkEdit[] = await getAllCustomBulkEdits();
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Custom Bulk Edit retrieval success',
            payload: customBulkEdits
        } as ApiResponse<CustomDataExport[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/custom-bulk-edits`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;