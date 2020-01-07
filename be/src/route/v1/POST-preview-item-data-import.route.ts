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
import fileType from "file-type";
import {ItemDataImport} from "../../model/data-import.model";
import {preview} from "../../service/import-csv/import-item.service";
import {makeApiError, makeApiErrorObj} from "../../util";
import jsonStringifySafe from 'json-stringify-safe';
import {ROLE_EDIT} from "../../model/role.model";

const uuid = require('uuid');
const detectCsv = require('detect-csv');


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        // body('itemDataCsvFile').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const name: string = `item-data-import-${uuid()}`;
        const {fields, files} = await multipartParse(req);

        await doInDbConnection(async (conn: Connection) => {

            const q: QueryResponse = await conn.query(`INSERT INTO TBL_DATA_IMPORT (VIEW_ID, NAME, TYPE) VALUES (?,?,'ITEM')`, [viewId, name]);
            const dataImportId: number = q.insertId;

            const itemDataCsvFile: File = files.itemDataCsvFile;

            const content: Buffer  = await util.promisify(fs.readFile)(itemDataCsvFile.path);

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
                [dataImportId, itemDataCsvFile.name, mimeType, content.length, content]);

            const itemDataImport: ItemDataImport = await preview(viewId, dataImportId, content);
            res.status(200).json(itemDataImport);
        });

    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/items/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
