import {Attribute2, AttributeMetadata2, AttributeMetadataEntry2} from "../server-side-model/server-side.model";
import {Attribute, AttributeType} from "../model/attribute.model";
import {attributeConvert, attributesConvert, attributesRevert} from "./conversion-attribute.service";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {LoggingCallback} from "./job-log.service";
import {LimitOffset} from "../model/limit-offset.model";
import {LIMIT_OFFSET} from "../util/utils";
import {ENABLED, Status} from "../model/status.model";
import {
    ChangeAttributeStatusEvent,
    fireEvent,
    GetAttributeInViewByNameEvent,
    GetAttributeInViewEvent,
    GetAttributesInViewEvent,
    SaveAttributesEvent,
    SearchAttributesByViewEvent,
    UpdateAttributesEvent
} from "./event/event.service";


const q1_count: string = `
                SELECT
                    COUNT(A.ID) AS COUNT
                FROM TBL_VIEW_ATTRIBUTE AS A
                WHERE A.VIEW_ID = ? AND A.STATUS='ENABLED'
`;

const q2_count: string = `
                SELECT
                    COUNT(A.ID) AS COUNT
                FROM TBL_VIEW_ATTRIBUTE AS A
                WHERE A.VIEW_ID = ? AND A.STATUS='ENABLED' AND A.ID IN ?
`;

const q1 = (limitOffset: LimitOffset) => `
                SELECT
                    A.ID AS A_ID
                FROM TBL_VIEW_ATTRIBUTE AS A
                WHERE A.VIEW_ID = ? AND A.STATUS='ENABLED'
                ${LIMIT_OFFSET(limitOffset)}
`;

const q2 = (limitOffset: LimitOffset) => `
                SELECT
                    A.ID AS A_ID
                FROM TBL_VIEW_ATTRIBUTE AS A
                WHERE A.VIEW_ID = ? AND A.STATUS='ENABLED' AND A.ID IN ?
                ${LIMIT_OFFSET(limitOffset)}
`;

// no need to filter by status, cause we want a particular attribute by a specific id
const q_ = () => `
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
                WHERE A.ID IN ?
`;

const q_byName = () => `
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
                WHERE A.VIEW_ID = ? AND A.NAME = ? AND A.STATUS = ?
`

export interface UpdateAttributesResult {errors: string[], updatedAttributeIds: number[]};
class AttributeService {

    // =====================
    // === updateAttribute ===
    // =======================
    async updateAttributes (attributes: Attribute[]): Promise<UpdateAttributesResult> {
        return await doInDbConnection(async (conn: Connection) => {
            const errors: string[] = [];
            const atts2: Attribute2[] = attributesRevert(attributes);
            const updatedAttributeIds: number[] = [];

            for (const att2 of atts2) {

                const q: QueryA = await conn.query('SELECT STATUS FROM TBL_VIEW_ATTRIBUTE WHERE ID = ?', [att2.id]);
                if (q.length <= 0) {  // no such attribute found
                    errors.push(`Attribute with id ${att2.id} not found`);
                    continue;
                }
                else if (q.length && q[0].STATUS !== 'ENABLED') {
                    errors.push(`Attribute with id ${att2.id} is no enabled`);
                    continue;
                }

                await conn.query(`DELETE FROM TBL_VIEW_ATTRIBUTE_METADATA WHERE VIEW_ATTRIBUTE_ID = ? `, [att2.id]);
                await conn.query(`UPDATE TBL_VIEW_ATTRIBUTE SET TYPE=?, NAME=?, DESCRIPTION=? WHERE ID=? `, [att2.type, att2.name, att2.description, att2.id]);

                for (const metadata of att2.metadatas) {
                    const qMeta: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?,?)`, [att2.id, metadata.name]);
                    const metadataId: number = qMeta.insertId;
                    for (const entry of metadata.entries) {
                        await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, \`KEY\`, \`VALUE\`) VALUES (?,?,?)`, [metadataId, entry.key, entry.value]);
                    }
                }
                updatedAttributeIds.push(att2.id);
            }

            const r: UpdateAttributesResult = {
                errors,
                updatedAttributeIds
            }

            fireEvent({
                type: "UpdateAttributesEvent",
                updateAttributesResult: r
            } as UpdateAttributesEvent);

            return r;
        });
    }


    // =============================
    // === changeAttributeStatus ===
    // =============================
    async changeAttributeStatus(attributeId: number, status: Status): Promise<boolean> {
        const r: boolean =  await doInDbConnection(async (conn: Connection) => {
            const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW_ATTRIBUTE SET STATUS = ? WHERE ID = ? `, [status, attributeId]);
            return (q.affectedRows > 0);
        });

        fireEvent({
            type: "ChangeAttributeStatusEvent",
            success: r,
            attributeId,
            attributeStatus: status
        } as ChangeAttributeStatusEvent);

        return r;
    };




    // ================================
    // === getTotalAttributesInView ===
    // ================================
    async getTotalAttributesInView(viewId: number, attributeIds?: number[]): Promise<number> {
        return await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await (
                attributeIds && attributeIds.length > 0 ?
                    conn.query(q2_count, [viewId, attributeIds]) :
                    conn.query(q1_count, [viewId])
            );
            return q[0].COUNT;
        });
    };


    // =================================
    // === getAttributeInViewByName ===
    // =================================
    async getAttributeInViewByName(viewId: number, attributeName: string): Promise<Attribute> {
        const attribute2: Attribute2 = await this.getAttribute2InViewByName(viewId, attributeName);
        let attribute: Attribute = null;
        if (attribute2) {
            attribute =  attributeConvert(attribute2);
        }
        fireEvent({
            type: 'GetAttributeInViewByNameEvent',
            viewId, attribute
        } as GetAttributeInViewByNameEvent);
        return attribute;
    }
    async getAttribute2InViewByName(viewId: number, attributeName: string): Promise<Attribute2> {
        return doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(q_byName(), [viewId, attributeName, ENABLED]);
            if (q && q.length > 0) {
                const att: Attribute2 = {
                    id: q[0].A_ID,
                    name: q[0].A_NAME,
                    description: q[0].A_DESCRIPTION,
                    type: q[0].A_TYPE,
                    creationDate: q[0].A_CREATION_DATE,
                    lastUpdate: q[0].A_LAST_UPDATE,
                    metadatas: []
                } as Attribute2;
                return att;
            }
            return null;
        });
    }


    // ============================
    // === getAttributeInView ====
    // ============================
    async getAttributeInView(viewId: number, attributeId: number): Promise<Attribute> {
        const attributes: Attribute[] = await getAttributesInView(viewId, [attributeId]);
        let attribute: Attribute = null;
        if (attributes && attributes.length) {
            attribute = attributes[0];
        }
        fireEvent({
            type: "GetAttributeInViewEvent",
            attribute,
            viewId
        } as GetAttributeInViewEvent);
        return attribute;
    };


    // ============================
    // === getAttributesInView ====
    // ============================
    async getAttributesInView(viewId: number, attributeIds?: number[], limitOffset?: LimitOffset): Promise<Attribute[]> {
        const attribute2s: Attribute2[] = await this.getAttribute2sInView(viewId, attributeIds, limitOffset);
        const attributes: Attribute[] =  attributesConvert(attribute2s);
        fireEvent({
            type: "GetAttributesInViewEvent",
            viewId,
            attributes,
            limitOffset
        } as GetAttributesInViewEvent);
        return attributes;
    };
    async getAttribute2sInView(viewId: number, attributeIds?: number[], limitOffset?: LimitOffset): Promise<Attribute2[]> {
        return await doInDbConnection(async (conn: Connection) => {

            const qq: QueryA = await (
                attributeIds && attributeIds.length > 0 ?
                    conn.query(q2(limitOffset), [viewId, attributeIds]) :
                    conn.query(q1(limitOffset), [viewId]));

            const attIds: number[] = await qq.reduce((acc: number[], i: QueryI) => {
                acc.push(i.A_ID);
                return acc;
            }, []);


            const q: QueryA = await conn.query(q_(), [attIds.length ? attIds : [-1]]);

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

            return ats;
        });
    }

    // ======================
    // === saveAttributes ===
    // ======================
    async saveAttributes(viewId: number, att: Attribute[], loggingCallback?: LoggingCallback): Promise<string[]> {
        loggingCallback && loggingCallback('INFO', `converting attribute to attribute2`);
        const att2s: Attribute2[] = attributesRevert(att);
        loggingCallback && loggingCallback('INFO', `converted attribute to attribute2`)
        const errors: string[] =  await this.saveAttribute2s(viewId, att2s, loggingCallback);
        fireEvent({
            type: "SaveAttributesEvent",
            viewId,
            attributes: att,
            errors
        } as SaveAttributesEvent);
        return errors;
    };
    async saveAttribute2s(viewId: number, attrs2: Attribute2[], loggingCallback?: LoggingCallback): Promise<string[]> {
        const errors: string[] = [];
        await doInDbConnection(async (conn: Connection) => {
            for (const att2 of attrs2) {

                const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_VIEW_ATTRIBUTE WHERE NAME = ? AND VIEW_ID=?`, [att2.name, viewId]);
                if (qq[0].COUNT > 0) {
                    errors.push(`Attribute name ${att2.name} already exists for view id ${viewId}`);
                    loggingCallback && loggingCallback('WARN', `attribute ${att2.name} already exists in view id ${viewId}`);
                    continue;
                }

                loggingCallback && loggingCallback('INFO', `adding attribute ${att2.name}`);

                const qAtt: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (VIEW_ID, TYPE, NAME, DESCRIPTION, STATUS) VALUES (?,?,?,?, 'ENABLED') `, [viewId, att2.type, att2.name, att2.description]);
                const attrbuteId: number = qAtt.insertId;

                for (const meta of att2.metadatas) {

                    const qMeta: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?,?)`, [attrbuteId, meta.name]);
                    const metaId: number = qMeta.insertId;

                    for (const entry of meta.entries) {
                        await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, \`KEY\`, \`VALUE\`) VALUES (?,?,?)`, [metaId, entry.key, entry.value]);
                    }
                }
            }
        });
        return errors;
    }


    // ==============================
    // === searchAttributesByView ===
    // ==============================
    async searchAttributesByView(viewId: number, search?: string): Promise<Attribute[]> {
        const attribute2s: Attribute2[] = await this.searchAttribute2sByView(viewId, search);
        const attributes: Attribute[] =  attributesConvert(attribute2s);
        fireEvent({
            type: 'SearchAttributesByViewEvent',
            search, viewId, attributes
        } as SearchAttributesByViewEvent);
        return attributes;
    };
    async searchAttribute2sByView(viewId: number, search?: string): Promise<Attribute2[]> {
        return await doInDbConnection(async (conn: Connection) => {
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
                `, [viewId, `%${search}%`]);

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
            return ats;
        });
    };
}

const s = new AttributeService()
export const
    updateAttributes = s.updateAttributes.bind(s),
    changeAttributeStatus = s.changeAttributeStatus.bind(s),
    getTotalAttributesInView = s.getTotalAttributesInView.bind(s),
    getAttributeInViewByName = s.getAttributeInViewByName.bind(s),
    getAttributeInView = s.getAttributeInView.bind(s),
    getAttributesInView = s.getAttributesInView.bind(s),
    saveAttributes = s.saveAttributes.bind(s),
    searchAttributesByView = s.searchAttributesByView.bind(s)