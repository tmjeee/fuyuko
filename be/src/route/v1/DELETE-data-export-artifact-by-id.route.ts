import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from "../../model/role.model";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from "../../model/api-response.model";

const httpAction: any[] = [
    [
        param('dataExportArtifactId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const dataExportArtifactId: number = Number(req.params.dataExportArtifactId);

        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`
                DELETE FROM TBL_DATA_EXPORT WHERE ID=?
            `, [dataExportArtifactId]);
        });

        res.status(200).json({
            status: 'SUCCESS',
            message: `Data Export artfact deleted`
        } as ApiResponse);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/data-export-artifact/:dataExportArtifactId`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
};


export default reg;