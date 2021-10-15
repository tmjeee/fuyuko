import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {deleteExportArtifactById} from "../../service/export-artifact.service";
import {toHttpStatus} from "./aid.";

export const invocation = async (dataExportArtifactId: number): Promise<ApiResponse> => {
    const r: boolean = await deleteExportArtifactById(dataExportArtifactId);

    if (r) {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'SUCCESS',
                message: `Data Export artifact deleted`
            }]
        };
        return apiResponse;
    } else {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'ERROR',
                message: `Data Export artifact Failed to be deleted`
            }]
        };
        return apiResponse;
    }
}

// CHECKED
const httpAction: any[] = [
    [
        param('dataExportArtifactId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const dataExportArtifactId: number = Number(req.params.dataExportArtifactId);

        const apiResponse = await invocation(dataExportArtifactId);
        const httpStatus = toHttpStatus(apiResponse);
        res.status(httpStatus).json(apiResponse);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/data-export-artifact/:dataExportArtifactId`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
};


export default reg;
