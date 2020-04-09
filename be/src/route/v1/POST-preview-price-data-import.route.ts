import {Registry} from "../../registry";
import {NextFunction, Request, Response, Router} from "express";
import {param, body} from "express-validator";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {multipartParse} from "../../service";
import {File} from "formidable";
import * as util from "util";
import * as fs from "fs";
import {PriceDataImport} from "../../model/data-import.model";
import {preview} from "../../service/import-csv/import-price.service";
import {makeApiError, makeApiErrorObj} from "../../util";
import {ROLE_EDIT} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";

const uuid = require('uuid');
const detectCsv = require('detect-csv');

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        // body('priceDataCsvFile').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const name: string = `price-data-import-${uuid()}`;
        const {fields, files} = await multipartParse(req);

        await doInDbConnection(async (conn: Connection) => {

            const q: QueryResponse = await conn.query(`INSERT INTO TBL_DATA_IMPORT (VIEW_ID, NAME, TYPE) VALUES (?,?,'PRICE')`, [viewId, name]);
            const dataImportId: number = q.insertId;

            const priceDataCsvFile: File = files.priceDataCsvFile;

            const content: Buffer  = await util.promisify(fs.readFile)(priceDataCsvFile.path);

            let mimeType = undefined;
            if (detectCsv(content)) {
                mimeType = 'text/csv';
            } else {
                res.status(200).json(
                    makeApiErrorObj(
                        makeApiError(`Only support csv import`, `attributeDataCsvFile`, ``, `API`)
                    )
                );
                return;
            }

            await conn.query(`INSERT INTO TBL_DATA_IMPORT_FILE (DATA_IMPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)`,
                [dataImportId, priceDataCsvFile.name, mimeType, content.length, content]);

            const priceDataImport: PriceDataImport = await preview(viewId, dataImportId, content);
            res.status(200).json({
                status: 'SUCCESS',
                message: `Price data import preview ready`,
                payload: priceDataImport
            } as ApiResponse<PriceDataImport>);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/prices/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
