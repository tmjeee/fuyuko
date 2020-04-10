import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {DataExportArtifact} from "../../model/data-export.model";
import {View} from "../../model/view.model";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED
const httpAction: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const dataExportArtifact: DataExportArtifact =  await doInDbConnection(async (conn: Connection) => {

            const q: QueryA = await conn.query(`
                SELECT 
                    E.ID AS E_ID,
                    E.VIEW_ID AS E_VIEW_ID,
                    E.NAME AS E_NAME,
                    E.TYPE AS E_TYPE,
                    E.CREATION_DATE AS E_CREATION_DATE,
                    E.LAST_UPDATE AS E_LAST_UPDATE,
                    
                    V.ID AS V_ID,
                    V.NAME AS V_NAME,
                    V.DESCRIPTION AS V_DESCRIPTION,
                    V.STATUS AS V_STATUS,
                    V.CREATION_DATE AS V_CREATION_DATE,
                    V.LAST_UPDATE AS V_LAST_UPDATE,
                    
                    F.ID AS F_ID,
                    F.NAME AS F_NAME,
                    F.MIME_TYPE AS F_MIME_TYPE,
                    F.SIZE AS F_SIZE
                    
                FROM TBL_DATA_EXPORT AS E
                LEFT JOIN TBL_VIEW AS V ON V.ID = E.VIEW_ID
                LEFT JOIN TBL_DATA_EXPORT_FILE AS F ON F.DATA_EXPORT_ID = E.ID
                ORDER BY E.LAST_UPDATE DESC
            `);

            return q.reduce((acc: DataExportArtifact[], i: QueryI) => {
                const a = {
                    view: {} as View
                } as DataExportArtifact;
                a.id = i.E_ID;
                a.name = i.E_NAME;
                a.type = i.E_TYPE;
                a.creationDate = i.E_CREATION_DATE;
                a.lastUpdate = i.E_LAST_UPDATE;
                a.view.id = i.V_ID;
                a.view.name = i.V_NAME;
                a.view.description = i.V_DESCRIPTION;
                a.view.creationDate = i.V_CREATION_DATE;
                a.view.lastUpdate = i.V_LAST_UPDATE;
                a.fileName = i.F_NAME;
                a.mimeType = i.F_MIME_TYPE;
                a.size = i.F_SIZE;
                acc.push(a);
                return acc;
            }, []);
        });

        res.status(200).json({
            status: 'SUCCESS',
            message: `Data export artifact retrieved successfully`,
            payload: dataExportArtifact
        } as ApiResponse<DataExportArtifact>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/data-export-artifacts`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);

};

export default reg;