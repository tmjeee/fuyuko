import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import { param } from "express-validator";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";

const httpAction: any[] = [
    [
        param(`dataExportId`).exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const dataExportId: number = Number(req.params.dataExportId);

        const r = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                    ID, DATA_EXPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT, CREATION_DATE, LAST_UPDATE
                FROM TBL_DATA_EXPORT_FILE 
                WHERE DATA_EXPORT_ID=?
            `, [dataExportId])

            if (q.length > 0) {
                return {
                    id: q[0].DATA_EXPORT_ID,
                    name: q[0].NAME,
                    mimeType: q[0].MIME_TYPE,
                    size: q[0].SIZE,
                    content: q[0].CONTENT
                }
            }
            return null
        });

        if (r) {
            res.status(200)
                .contentType(r.mimeType)
                .header('Content-Length', r.size)
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