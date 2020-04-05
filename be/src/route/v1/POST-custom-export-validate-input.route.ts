import {Registry} from "../../registry";
import {NextFunction, Request, Response, Router} from "express";
import {body, param} from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from "../../model/role.model";
import {validate} from "../../custom-import/custom-import-executor";
import {ExportScriptInputValue, ExportScriptValidateResult} from "../../model/custom-export.model";


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('customExportId').exists().isNumeric(),
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
        const customExportId: number = Number(req.params.customExportId);
        const values: ExportScriptInputValue[] = req.body.values;

        /*
        console.log('****** values', util.inspect(values, {depth: 5}));
        const x: ImportScriptInputValue = values.find((i: ImportScriptInputValue) => i.name === 'file input');
        if (x && x.value && (x.value as FileDataObject).data) {
            const a: FileDataObject = new FileDataObject(x.value as FileDataObject);
            const b: Buffer = a.getDataAsBuffer();
            await (util.promisify(fs.writeFile))(`/home/tmjee/cockpit/xxx.jpeg`, b);
        }
        */

        const r: ExportScriptValidateResult = await validate(viewId, customExportId, values);

        res.status(200).json(r);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-export/:customExportId/validate-input`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};


export default reg;