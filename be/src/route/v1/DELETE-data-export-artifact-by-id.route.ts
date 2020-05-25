import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";
import {deleteExportArtifactById} from "../../service/export-artifact.service";

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

        const r: boolean = await deleteExportArtifactById(dataExportArtifactId);

        if (r) {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Data Export artifact deleted`
            } as ApiResponse);
        } else {
            res.status(400).json({
                status: 'ERROR',
                message: `Data Export artifact Failed to be deleted`
            } as ApiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/data-export-artifact/:dataExportArtifactId`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
};


export default reg;