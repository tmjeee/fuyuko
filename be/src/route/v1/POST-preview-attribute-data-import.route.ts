import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {param} from 'express-validator';
import {doInDbConnection, QueryResponse} from "../../db";
import {PoolConnection} from "mariadb";
import {multipartParse} from "../../service";
import {File} from 'formidable';
import * as util from "util";
import * as fs from "fs";


const uuid = require('uuid');
import fileType from 'file-type';
import {previewAttributeDataImport} from "../../service/import-csv/import-attribute.service";
import {AttributeDataImport} from "../../model/data-import.model";



const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const name: string = `attribute-data-import-${uuid()}`;

        const {content, dataImportId}: {content: Buffer, dataImportId: number} = await doInDbConnection(async (conn: PoolConnection) => {

            const q: QueryResponse = await conn.query(`INSERT INTO TBL_DATA_IMPORT (VIEW_ID, NAME, TYPE) VALUES (?,?,'ATTRIBUTE')`, [viewId, name]);
            const dataImportId: number = q.insertId;

            const {fields, files} = await multipartParse(req);

            const attributeDataCsvFile: File = files.attributeDataCsvFile;

            const content: Buffer  = await util.promisify(fs.readFile)(attributeDataCsvFile.path);

            const fileTypeResult: fileType.FileTypeResult = fileType(content);

            await conn.query(`INSERT INTO TBL_DATA_IMPORT_FILE (DATA_IMPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)`,
                [dataImportId, attributeDataCsvFile.name, fileTypeResult.mime, content.length, content]);

            return {content, dataImportId};
        });

        const attributeDataImport: AttributeDataImport = await previewAttributeDataImport(viewId, dataImportId, content);
        res.status(200).json(attributeDataImport);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/import/attributes/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
