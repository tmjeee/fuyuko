import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {makeApiError, makeApiErrorObj} from "../../util";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {getExportArtifactContent} from "../../service/export-artifact.service";
import {BinaryContent} from '@fuyuko-common/model/binary-content.model';

// CHECKED
const httpAction: any[] = [
    [
        param(`dataExportId`).exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const dataExportId: number = Number(req.params.dataExportId);
        const r: BinaryContent = await  getExportArtifactContent(dataExportId);

        if (r) {
            res.status(200)
                .contentType(r.mimeType)
                .header('Content-Length', String(r.size))
                .end(r.content);
        } else {
            res.status(400).json(
                makeApiErrorObj(
                    makeApiError(`data export file for id ${dataExportId} not found`)
                )
            );
        }
    }
];

export const reg = (router: Router, registry: Registry) => {
    const p = `/data-export/:dataExportId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
