import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {DataExportArtifact} from '@fuyuko-common/model/data-export.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getAllExportArtifacts} from "../../service/export-artifact.service";
import {toHttpStatus} from "./aid.";

export const invocation = async (): Promise<ApiResponse<DataExportArtifact[]>> => {
    const dataExportArtifact: DataExportArtifact[] = await getAllExportArtifacts();
    const apiResponse: ApiResponse<DataExportArtifact[]> = {
        messages:  [{
            status: 'SUCCESS',
            message: `Data export artifact retrieved successfully`,
        }],
        payload: dataExportArtifact
    }
    return apiResponse;
}

// CHECKED
const httpAction: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const apiResponse = await invocation();
        res.status(toHttpStatus(apiResponse)).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/data-export-artifacts`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);

};

export default reg;
