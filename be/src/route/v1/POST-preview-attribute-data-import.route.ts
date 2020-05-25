import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {param, body, check, Meta} from 'express-validator';
import {doInDbConnection, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {multipartParse} from "../../service";
import {File, IncomingForm} from 'formidable';
import * as util from "util";
import * as fs from "fs";


const uuid = require('uuid');
import {preview} from "../../service/import-csv/import-attribute.service";
import {AttributeDataImport} from "../../model/data-import.model";
import {makeApiError, makeApiErrorObj} from "../../util";
import {ROLE_EDIT} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";

const detectCsv = require('detect-csv');


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

        const r: {errors: string[], attributeDataImport: AttributeDataImport} = await preview(viewId, files.attributeDataCsvFile);
        if (r.errors && r.errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: r.errors.join(', '),
                payload: r.attributeDataImport
            } as ApiResponse<AttributeDataImport>);

        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Attribute Data Import preview ready`,
                payload: r.attributeDataImport
            } as ApiResponse<AttributeDataImport>);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/attributes/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
