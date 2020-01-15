import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {param} from 'express-validator';
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";
import {ROLE_VIEW} from "../../model/role.model";

const httpAction: any[] = [
    [
        param('exportDataId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const exportDataId: number = Number(req.params.exportDataId);

        const q: QueryA = await doInDbConnection(async (conn: Connection) => {

            const q: QueryA = await conn.query( `
                SELECT ID, DATA_EXPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT FROM TBL_DATA_EXPORT_FILE WHERE DATA_EXPORT_ID= ?
            `, [exportDataId]);

            return q;
        });

        if (q.length > 0) {
            const contentType: string = q[0].MIME_TYPE;
            const content: Buffer = q[0].CONTENT;
            const length: number = q[0].SIZE;
            res.setHeader('Content-Length', length);
            res.status(200).contentType(contentType);
            res.end(content);

        } else {
            const r = makeApiErrorObj(
                makeApiError(`Data export id not found`, `dataExportId`, ``, `API`)
            );
            res.status(200).json(r);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/export/:exportDataId/file`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;