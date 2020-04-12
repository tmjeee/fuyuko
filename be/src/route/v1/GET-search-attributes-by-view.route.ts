import {NextFunction, Request, Response, Router} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {attributesConvert} from "../../service/conversion-attribute.service";
import {Attribute2, AttributeMetadata2, AttributeMetadataEntry2} from "../../server-side-model/server-side.model";
import {Attribute} from "../../model/attribute.model";
import {check} from 'express-validator';
import {ROLE_VIEW} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric(),
        check('attribute')
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const attribute: string = req.params.attribute ? req.params.attribute : '';

        await doInDbConnection(async (conn: Connection) => {

            const q: QueryA = await conn.query(`
                SELECT
                    A.ID AS A_ID,
                    A.VIEW_ID AS A_VIEW_ID,
                    A.TYPE AS A_TYPE,
                    A.NAME AS A_NAME,
                    A.DESCRIPTION AS A_DESCRIPTION,
                    A.CREATION_DATE AS A_CREATION_DATE,
                    A.LAST_UPDATE AS A_LAST_UPDATE,
                    M.ID as M_ID,
                    M.NAME AS M_NAME,
                    E.ID as E_ID,
                    E.KEY AS E_KEY,
                    E.VALUE AS E_VALUE
                FROM TBL_VIEW_ATTRIBUTE AS A
                LEFT JOIN TBL_VIEW_ATTRIBUTE_METADATA AS M ON M.VIEW_ATTRIBUTE_ID = A.ID
                LEFT JOIN TBL_VIEW_ATTRIBUTE_METADATA_ENTRY AS E ON E.VIEW_ATTRIBUTE_METADATA_ID = M.ID
                WHERE A.VIEW_ID = ? AND A.NAME LIKE ?
            `, [viewId, `%${attribute}%`]);

            const a: Map<string /* attributeId */, Attribute2> = new Map();
            const m: Map<string /* attributeId_metadataId */, AttributeMetadata2> = new Map();
            const e: Map<string /* attributeId_metadataId_entryId */, AttributeMetadataEntry2> = new Map();

            const ats: Attribute2[] = q.reduce((acc: Attribute2[], i: QueryI) => {

                const attributeId: number = i.A_ID;
                const metadataId: number = i.M_ID;
                const entryId: number = i.E_ID;

                const aK: string = `${attributeId}`;
                if (!a.has(aK)) {
                    const att: Attribute2 = {
                        id: i.A_ID,
                        name: i.A_NAME,
                        description: i.A_DESCRIPTION,
                        type: i.A_TYPE,
                        creationDate: i.A_CREATION_DATE,
                        lastUpdate: i.A_LAST_UPDATE,
                        metadatas: []
                    } as Attribute2;
                    a.set(aK, att);
                    acc.push(att);
                }

                const mK: string = `${attributeId}_${metadataId}`;
                if (!m.has(mK) && attributeId && metadataId) {
                    const met: AttributeMetadata2 = {
                        id: i.M_ID,
                        name: i.M_NAME,
                        entries: []
                    } as AttributeMetadata2;
                    m.set(mK, met);
                    a.get(aK).metadatas.push(met);
                }

                const eK: string = `${attributeId}_${metadataId}_${entryId}`;
                if (!e.has(eK) && attributeId && metadataId && entryId) {
                    const ent: AttributeMetadataEntry2 = {
                        id: i.E_ID,
                        key: i.E_KEY,
                        value: i.E_VALUE
                    } as AttributeMetadataEntry2;
                    m.get(mK).entries.push(ent);
                }
                return acc;
            }, []);

            const attr: Attribute[] = attributesConvert(ats);

            res.status(200).json({
                status: 'SUCCESS',
                message: `Attributes retrieved`,
                payload: attr
            } as ApiResponse<Attribute[]>);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/attributes/view/:viewId/search/:attribute?`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
