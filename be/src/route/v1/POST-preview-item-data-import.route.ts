import {Registry} from "../../registry";
import {NextFunction, Request, Response, Router} from "express";
import {param, body} from "express-validator";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryResponse} from "../../db";
import {PoolConnection} from "mariadb";
import {multipartParse} from "../../service";
import {File} from "formidable";
import * as util from "util";
import * as fs from "fs";
import fileType from "file-type";
import {ItemDataImport} from "../../model/data-import.model";
import {preview} from "../../service/import-csv/import-item.service";

const uuid = require('uuid');


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('itemDataCsvFile').exists()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const name: string = `price-data-import-${uuid()}`;

        const {content, dataImportId}: {content: Buffer, dataImportId: number} = await doInDbConnection(async (conn: PoolConnection) => {

            const q: QueryResponse = await conn.query(`INSERT INTO TBL_DATA_IMPORT (VIEW_ID, NAME, TYPE) VALUES (?,?,'ITEM')`, [viewId, name]);
            const dataImportId: number = q.insertId;

            const {fields, files} = await multipartParse(req);

            const itemDataCsvFile: File = files.itemDataCsvFile;

            const content: Buffer  = await util.promisify(fs.readFile)(itemDataCsvFile.path);

            const fileTypeResult: fileType.FileTypeResult = fileType(content);

            await conn.query(`INSERT INTO TBL_DATA_IMPORT_FILE (DATA_IMPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)`,
                [dataImportId, itemDataCsvFile.name, fileTypeResult.mime, content.length, content]);

            return {content, dataImportId};
        });

        const itemDataImport: ItemDataImport = await preview(viewId, dataImportId, content);
        res.status(200).json(itemDataImport);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/items/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
