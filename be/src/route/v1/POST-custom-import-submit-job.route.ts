import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import { param, body } from "express-validator";
import {ROLE_EDIT} from "../../model/role.model";
import {
    ImportScriptInputValue,
    ImportScriptJobSubmissionResult,
    ImportScriptPreview
} from "../../model/custom-import.model";
import {runCustomImportJob} from "../../custom-import/custom-import-executor";

const httpAction: any[] = [
    [
        param('customImportId').exists().isNumeric(),
        param('viewId').exists().isNumeric(),
        body('values').isArray(),
        body('preview'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
       const customImportId: number = Number(req.params.customImportId);
       const viewId: number = Number(req.params.viewId);
       const values: ImportScriptInputValue[] = req.body.values;
       const preview: ImportScriptPreview = req.body.preview;

       const r: ImportScriptJobSubmissionResult = await runCustomImportJob(viewId, customImportId, values, preview);
       res.status(200).json(r);
    }
]


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-import/:customImportId/submit-job`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;