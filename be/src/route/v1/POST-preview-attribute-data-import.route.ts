import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {param} from 'express-validator';
import {multipartParse} from '../../service';
import {importAttributePreview} from "../../service";
import {AttributeDataImport} from '@fuyuko-common/model/data-import.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from "@fuyuko-common/model/api-response.model";

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        // body('attributeDataCsvFile').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const {fields, files} = await multipartParse(req);

        const r: {errors: string[], attributeDataImport: AttributeDataImport} = await importAttributePreview(viewId, files.attributeDataCsvFile);
        if (r.errors && r.errors.length) {
            const apiResponse: ApiResponse<AttributeDataImport> = {
                messages: [{
                    status: 'ERROR',
                    message: r.errors.join(', '),
                }],
                payload: r.attributeDataImport
            };
            res.status(400).json(apiResponse);
        } else {
            const apiResponse: ApiResponse<AttributeDataImport> = {
                messages: [{
                    status: 'SUCCESS',
                    message: `Attribute Data Import preview ready`,
                }],
                payload: r.attributeDataImport
            };
            res.status(200).json(apiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/attributes/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
