import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn, validateUserInAnyRoleMiddlewareFn} from "./common-middleware";
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

const detectCsv = require('detect-csv');


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        // body('attributeDataCsvFile').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    validateUserInAnyRoleMiddlewareFn([ROLE_EDIT]),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const name: string = `attribute-data-import-${uuid()}`;
        const {fields, files} = await multipartParse(req);

        await doInDbConnection(async (conn: Connection) => {

            const q: QueryResponse = await conn.query(`INSERT INTO TBL_DATA_IMPORT (VIEW_ID, NAME, TYPE) VALUES (?,?,'ATTRIBUTE')`, [viewId, name]);
            const dataImportId: number = q.insertId;

            const attributeDataCsvFile: File = files.attributeDataCsvFile;

            const content: Buffer  = await util.promisify(fs.readFile)(attributeDataCsvFile.path);

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
                [dataImportId, attributeDataCsvFile.name, mimeType, content.length, content]);

            const attributeDataImport: AttributeDataImport = await preview(viewId, dataImportId, content);

            res.status(200).json(attributeDataImport);
        });

    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/attributes/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
