import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {PoolConnection} from "mariadb";
import {Attribute} from "../../model/attribute.model";
import {Attribute2, convert, Metadata2, MetadataEntry2} from "../../service/attribute-conversion.service";

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);

        await doInDbConnection(async (conn: PoolConnection) => {

            const q: QueryA = await conn.query(`
                SELECT
                    A.ID AS A_ID,
                    A.VIEW_ID AS A_VIEW_ID,
                    A.TYPE AS A_TYPE,
                    A.NAME AS A_NAME,
                    A.DESCRIPTION AS A_DESCRIPTION,
                    M.ID as M_ID,
                    M.NAME AS M_NAME,
                    E.ID as E_ID,
                    E.KEY AS E_KEY,
                    E.VALUE AS E_VALUE
                FROM TBL_ITEM_ATTRIBUTE AS A
                LEFT JOIN TBL_ITEM_ATTRIBUTE_METADATA AS M ON M.ITEM_ATTRIBUTE_ID = A.ID
                LEFT JOIN TBL_ITEM_ATTRIBUTE_METADATA_ENTRY AS E ON E.ITEM_ATTRIBUTE_METADATA_ID = M.ID
                WHERE A.VIEW_ID = ? AND A.STATUS='ENABLED'
            `, [viewId]);

            const a: Map<string /* attributeId */, Attribute2> = new Map();
            const m: Map<string /* attributeId_metadataId */, Metadata2> = new Map();
            const e: Map<string /* attributeId_metadataId_entryId */, MetadataEntry2> = new Map();

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
                        metadatas: []
                    } as Attribute2;
                    a.set(aK, att);
                    acc.push(att);
                }

                const mK: string = `${attributeId}_${metadataId}`;
                if (!m.has(mK) && attributeId && metadataId) {
                    const met: Metadata2 = {
                        id: i.M_ID,
                        name: i.M_NAME,
                        entries: []
                    } as Metadata2;
                    m.set(mK, met);
                    a.get(aK).metadatas.push(met);
                }

                const eK: string = `${attributeId}_${metadataId}_${entryId}`;
                if (!e.has(eK) && attributeId && metadataId && entryId) {
                    const ent: MetadataEntry2 = {
                       id: i.E_ID,
                       key: i.E_KEY,
                       value: i.E_VALUE
                    } as MetadataEntry2;
                    m.get(mK).entries.push(ent);
                }
                return acc;
            }, []);

            const attr: Attribute[] = convert(ats);

            res.status(200).json(attr);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/attributes/view/:viewId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
