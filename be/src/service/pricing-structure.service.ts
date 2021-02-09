import {
    PricingStructure, PricingStructureGroupAssociation,
    PricingStructureItemWithPrice,
} from "../model/pricing-structure.model";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {LIMIT_OFFSET} from "../util/utils";
import {getChildrenWithConn} from "./pricing-structure-item.service";
import {LimitOffset} from "../model/limit-offset.model";
import {Role, ROLE_PARTNER} from "../model/role.model";
import {Status} from "../model/status.model";
import { Group } from "../model/group.model";
import {
    AddOrUpdatePricingStructuresEvent,
    fireEvent,
    GetAllPricingStructureItemsWithPriceEvent,
    GetAllPricingStructuresEvent,
    GetPartnerPricingStructuresEvent, GetPricingStructureByIdEvent, GetPricingStructureByNameEvent,
    GetPricingStructureGroupAssociationsEvent,
    GetPricingStructuresByViewEvent,
    LinkPricingStructureWithGroupIdEvent,
    SearchGroupsAssociatedWithPricingStructureEvent,
    SearchGroupsNotAssociatedWithPricingStructureEvent,
    UnlinkPricingStructureWithGroupIdEvent,
    UpdatePricingStructureStatusEvent
} from "./event/event.service";

export interface AddOrUpdatePricingStructureInput { name: string; description: string;  viewId: number; status?: Status; id?: number };
class PricingStructureService {

    /**
     *  ======================================================
     *  === searchGroupsAssociatedWithPricingStructure ===
     *  ======================================================
     */
    async searchGroupsAssociatedWithPricingStructure(pricingStructureId: number, groupName?: string): Promise<Group[]> {
        const groups: Group[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
            SELECT 
                G.ID AS G_ID,
                G.NAME AS G_NAME,
                G.DESCRIPTION AS G_DESCRIPTION,
                G.STATUS AS G_STATUS,
                G.IS_SYSTEM AS G_IS_SYSTEM,
                G.CREATION_DATE AS G_CREATION_DATE,
                G.LAST_UPDATE AS G_LAST_UPDATE,
                R.ID AS R_ID,
                R.NAME AS R_NAME,
                R.DESCRIPTION AS R_DESCRIPTION,
                R.CREATION_DATE AS R_CREATION_DATE,
                R.LAST_UPDATE AS R_LAST_UPDATE
            FROM TBL_GROUP AS G
            LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS GR ON GR.GROUP_ID = G.ID
            LEFT JOIN TBL_ROLE AS R ON R.ID = GR.ROLE_ID
            WHERE G.ID IN (
                SELECT 
                   PSG.GROUP_ID
                FROM TBL_LOOKUP_PRICING_STRUCTURE_GROUP AS PSG
                WHERE PSG.PRICING_STRUCTURE_ID = ?
            ) AND G.NAME LIKE ?
        `, [pricingStructureId, `%${groupName ? groupName : ''}%`]);


            const g: Map<string /* groupId */, Group> = new Map();
            const r: Map<string /* groupId_roleId */, Role> = new Map();

            return q.reduce((a: Group[], i: QueryI) => {

                const groupKey = String(i.G_ID);
                const roleKey = `${i.G_ID}_${i.R_ID}`;

                if (!g.has(groupKey)) {
                    const group: Group = {
                        id: i.G_ID,
                        name: i.G_NAME,
                        isSystem: i.G_IS_SYSTEM,
                        description: i.G_DESCRIPTION,
                        status: i.G_STATUS,
                        roles: []
                    };
                    g.set(groupKey, group)
                    a.push(group);
                };

                if (i.R_ID && !r.has(roleKey)) {
                    const role: Role = {
                        id: i.R_ID,
                        name: i.R_NAME,
                        description: i.R_DESCRIPTION
                    };
                    r.set(roleKey, role);
                    g.get(groupKey).roles.push(role);
                }
                return a;
            }, []);
        });
        fireEvent({
            type: "SearchGroupsAssociatedWithPricingStructureEvent",
            pricingStructureId, groupName, groups
        } as SearchGroupsAssociatedWithPricingStructureEvent);
        return groups;
    };

    /**
     *  ======================================================
     *  === searchGroupsNotAssociatedWithPricingStructure ===
     *  ======================================================
     */
    async searchGroupsNotAssociatedWithPricingStructure(pricingStructureId: number, groupName?: string): Promise<Group[]> {
        const groups: Group[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
            SELECT 
                G.ID AS G_ID,
                G.NAME AS G_NAME,
                G.DESCRIPTION AS G_DESCRIPTION,
                G.STATUS AS G_STATUS,
                G.IS_SYSTEM AS G_IS_SYSTEM,
                G.CREATION_DATE AS G_CREATION_DATE,
                G.LAST_UPDATE AS G_LAST_UPDATE,
                R.ID AS R_ID,
                R.NAME AS R_NAME,
                R.DESCRIPTION AS R_DESCRIPTION,
                R.CREATION_DATE AS R_CREATION_DATE,
                R.LAST_UPDATE AS R_LAST_UPDATE
            FROM TBL_GROUP AS G
            LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS GR ON GR.GROUP_ID = G.ID
            LEFT JOIN TBL_ROLE AS R ON R.ID = GR.ROLE_ID
            WHERE G.ID NOT IN (
                SELECT 
                   PSG.GROUP_ID
                FROM TBL_LOOKUP_PRICING_STRUCTURE_GROUP AS PSG
                WHERE PSG.PRICING_STRUCTURE_ID = ?
            ) AND G.NAME LIKE ?
        `, [pricingStructureId, `%${groupName ? groupName : ''}%`]);


            const g: Map<string /* groupId */, Group> = new Map();
            const r: Map<string /* groupId_roleId */, Role> = new Map();

            return q.reduce((a: Group[], i: QueryI) => {

                const groupKey = String(i.G_ID);
                const roleKey = `${i.G_ID}_${i.R_ID}`;

                if (!g.has(groupKey)) {
                    const group: Group = {
                        id: i.G_ID,
                        name: i.G_NAME,
                        isSystem: i.G_IS_SYSTEM,
                        description: i.G_DESCRIPTION,
                        status: i.G_STATUS,
                        roles: []
                    };
                    g.set(groupKey, group)
                    a.push(group);
                };

                if (i.R_ID && !r.has(roleKey)) {
                    const role: Role = {
                        id: i.R_ID,
                        name: i.R_NAME,
                        description: i.R_DESCRIPTION
                    };
                    r.set(roleKey, role);
                    g.get(groupKey).roles.push(role);
                }
                return a;
            }, []);
        });

        fireEvent({
            type: "SearchGroupsNotAssociatedWithPricingStructureEvent",
            pricingStructureId, groupName, groups
        } as SearchGroupsNotAssociatedWithPricingStructureEvent);

        return groups;
    };

    /**
     *  ======================================================
     *  === getPricingStructureGroupAssociations ===
     *  ======================================================
     */
    async getPricingStructureGroupAssociations(): Promise<PricingStructureGroupAssociation[]> {
        const pricingStructureGroupAssociations: PricingStructureGroupAssociation[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
            SELECT 
                PS.ID AS PS_ID,
                PS.VIEW_ID AS PS_VIEW_ID,
                PS.NAME AS PS_NAME,
                PS.DESCRIPTION AS PS_DESCRIPTION,
                PS.STATUS AS PS_STATUS,
                PS.CREATION_DATE AS PS_CREATION_DATE,
                PS.LAST_UPDATE AS PS_LAST_UPDATE,
                V.ID AS V_ID,
                V.NAME AS V_NAME,
                V.DESCRIPTION AS V_DESCRIPTION,
                V.STATUS AS V_STATUS,
                V.CREATION_DATE AS V_CREATION_DATE,
                V.LAST_UPDATE AS V_LAST_UPDATE,
                G.ID AS G_ID,
                G.NAME AS G_NAME,
                G.DESCRIPTION AS G_DESCRIPTION,
                G.STATUS AS G_STATUS,
                G.IS_SYSTEM AS G_IS_SYSTEM,
                G.CREATION_DATE AS G_CREATION_DATE,
                G.LAST_UPDATE AS G_LAST_UPDATE,
                R.ID AS R_ID,
                R.NAME AS R_NAME,
                R.DESCRIPTION AS R_DESCRIPTION,
                R.CREATION_DATE AS R_CREATION_DATE,
                R.LAST_UPDATE AS R_LAST_UPDATE
            FROM TBL_PRICING_STRUCTURE AS PS
            LEFT JOIN TBL_VIEW AS V ON V.ID = PS.VIEW_ID
            LEFT JOIN TBL_LOOKUP_PRICING_STRUCTURE_GROUP AS PSG ON PSG.PRICING_STRUCTURE_ID = PS.ID
            LEFT JOIN TBL_GROUP AS G ON G.ID = PSG.GROUP_ID
            LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS GR ON GR.GROUP_ID = G.ID
            LEFT JOIN TBL_ROLE AS R ON R.ID = GR.ROLE_ID
        `);

            const m: Map<string /* pricingStructureId */, PricingStructureGroupAssociation> = new Map();
            const g: Map<string /* pricingStructureId_groupId */, Group> = new Map();
            const r: Map<string /* pricingStructureId_groupId_roleId */, Role> = new Map();

            return q.reduce((a: PricingStructureGroupAssociation[], i: QueryI) => {
                const pricingStructureKey = String(i.PS_ID);
                const groupKey = `${i.PS_ID}_${i.G_ID}`;
                const roleKey = `${i.PS_ID}_${i.G_ID}_${i.R_ID}`;
                if (!m.has(pricingStructureKey)) {
                    const pricingStructure: PricingStructure = {
                        id: i.PS_ID,
                        name: i.PS_NAME,
                        description: i.PS_DESCRIPTION,
                        status: i.PS_STATUS,
                        viewId: i.V_ID,
                        viewName: i.V_NAME,
                        lastUpdate: i.V_LAST_UPDATE,
                        creationDate: i.V_CREATION_DATE,
                    };
                    const pricingStructureGroupAssociation: PricingStructureGroupAssociation = {
                        pricingStructure,
                        groups: []
                    };
                    m.set(pricingStructureKey, pricingStructureGroupAssociation);
                    a.push(pricingStructureGroupAssociation);
                }
                if (i.G_ID && !g.has(groupKey)) {
                    const group: Group = {
                        id: i.G_ID,
                        name: i.G_NAME,
                        isSystem: i.G_IS_SYSTEM,
                        description: i.G_DESCRIPTION,
                        status: i.G_STATUS,
                        roles: []
                    };
                    g.set(groupKey, group)
                    m.get(pricingStructureKey).groups.push(group);
                };

                if (i.R_ID && !r.has(roleKey)) {
                    const role: Role = {
                        id: i.R_ID,
                        name: i.R_NAME,
                        description: i.R_DESCRIPTION
                    };
                    r.set(roleKey, role);
                    g.get(groupKey).roles.push(role);
                }
                return a;
            }, []);
        });

        fireEvent({
            type: "GetPricingStructureGroupAssociationsEvent",
            pricingStructureGroupAssociations
        } as GetPricingStructureGroupAssociationsEvent);

        return pricingStructureGroupAssociations;
    };


    /**
     *  ======================================================
     *  === linkPricingStructureWithGroupId ===
     *  ======================================================
     */
    async linkPricingStructureWithGroupId(pricingStructureId: number, groupId: number): Promise<string[]> {
        // todo: check if group has ROLE_PARTNER
        const errors: string[] = await doInDbConnection(async (conn: Connection) => {
            const errors: string[] = [];

            const _q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_LOOKUP_PRICING_STRUCTURE_GROUP WHERE PRICING_STRUCTURE_ID =? AND GROUP_ID = ?`, [pricingStructureId, groupId]);
            if (_q[0].COUNT > 0) {
                errors.push(`Pricing strucgture Id ${pricingStructureId} already linked to group ${groupId}`);
            } else {
                const qa: QueryA = await conn.query(`
            SELECT COUNT(GR.ID) AS COUNT FROM TBL_LOOKUP_GROUP_ROLE AS GR
            LEFT JOIN TBL_GROUP AS G ON G.ID = GR.GROUP_ID
            LEFT JOIN TBL_ROLE AS R ON R.ID = GR.ROLE_ID
            WHERE GR.GROUP_ID = ? AND R.NAME = ?
        `, [groupId, ROLE_PARTNER]);
                if (qa[0].COUNT <= 0) {
                    errors.push(`Group width id ${groupId} does not have PARTNER role`);
                } else {
                    const q: QueryResponse = await conn.query(`
            INSERT INTO TBL_LOOKUP_PRICING_STRUCTURE_GROUP (PRICING_STRUCTURE_ID, GROUP_ID) VALUES (?,?)
        `, [pricingStructureId, groupId]);
                    if (q.affectedRows <= 0) {
                        errors.push(`Failed to update pricing structure group`);
                    }
                }
            }
            return errors;
        });

        fireEvent({
            type:"LinkPricingStructureWithGroupIdEvent",
            pricingStructureId, groupId, errors
        } as LinkPricingStructureWithGroupIdEvent);

        return errors;
    };


    /**
     *  ======================================================
     *  === unlinkPricingStructureWithGroupId ===
     *  ======================================================
     */
    async unlinkPricingStructureWithGroupId(pricingStructureId: number, groupId: number): Promise<string[]> {
        const errors: string[] = await doInDbConnection(async (conn: Connection) => {
            const errors: string[] = [];
            const _q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_LOOKUP_PRICING_STRUCTURE_GROUP WHERE PRICING_STRUCTURE_ID=? AND GROUP_ID=?`, [pricingStructureId, groupId]);
            if (_q[0].COUNT <= 0) {
                errors.push(`Pricing structure ${pricingStructureId} is not linked to group ${groupId}`);
            } else {
                const q: QueryResponse = await conn.query(`
            DELETE FROM TBL_LOOKUP_PRICING_STRUCTURE_GROUP WHERE PRICING_STRUCTURE_ID =? AND GROUP_ID = ?
        `, [pricingStructureId, groupId]);
                if (q.affectedRows <= 0) {
                    errors.push(`Failed to unlink pricing structure ${pricingStructureId} with group ${groupId}`);
                }
            }
            return errors;
        });
        fireEvent({
            type: "UnlinkPricingStructureWithGroupIdEvent",
            pricingStructureId, groupId, errors
        } as UnlinkPricingStructureWithGroupIdEvent);
        return errors;
    }


    /**
     *  ======================================================
     *  === updatePricingStructureStatus ===
     *  ======================================================
     */
    async updatePricingStructureStatus(pricingStructureId: number, status: Status): Promise<boolean> {
        const result: boolean = await doInDbConnection(async (conn: Connection) => {
            const q: QueryResponse = await conn.query(`
                UPDATE TBL_PRICING_STRUCTURE SET STATUS=? WHERE ID=?
            `, [status, pricingStructureId]);
            return (q.affectedRows > 0);
        });
        fireEvent({
            type: "UpdatePricingStructureStatusEvent",
            pricingStructureId, status, result
        } as UpdatePricingStructureStatusEvent);
        return result;
    };


    /**
     *  ======================================================
     *  === addOrUpdatePricingStructures ===
     *  ======================================================
     */
    async addOrUpdatePricingStructures(pricingStructures: AddOrUpdatePricingStructureInput[]): Promise<string[]> {
        const errors: string[] = await doInDbConnection(async (conn: Connection) => {
            const errors: string[] = [];
            for (const pricingStructure of pricingStructures) {
                if (!pricingStructure.id || pricingStructure.id <= 0) { // insert
                    const viewId: number = pricingStructure.viewId;
                    const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_PRICING_STRUCTURE WHERE NAME=? AND VIEW_ID=?`, [pricingStructure.name, viewId]);
                    if (qq[0].COUNT > 0) {
                        errors.push(`Pricing structure with name ${pricingStructure.name} aready exists in view id ${viewId}`);
                    } else {
                        const q: QueryResponse = await conn.query(`
                                INSERT INTO TBL_PRICING_STRUCTURE (NAME, DESCRIPTION, VIEW_ID, STATUS) VALUE (?,?,?,?)
                            `, [pricingStructure.name, pricingStructure.description, pricingStructure.viewId, pricingStructure.status ? pricingStructure.status : 'ENABLED']);
                        if (q.affectedRows <= 0) {
                            errors.push(`Unable to persist pricing structure name ${pricingStructure.name}`);
                        }
                    }
                } else { // update
                    const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_PRICING_STRUCTURE WHERE ID=?`, [pricingStructure.id]);
                    if (qq[0].COUNT <= 0) { // pricing structure with id do not exists
                        errors.push(`Pricing structrue with id ${pricingStructure.id} do not exists`);
                    } else {
                        const q: QueryResponse = await conn.query(`
                            UPDATE TBL_PRICING_STRUCTURE SET NAME=?, DESCRIPTION=? WHERE ID=? AND VIEW_ID=? AND STATUS=? 
                        `, [pricingStructure.name, pricingStructure.description, pricingStructure.id, pricingStructure.viewId, pricingStructure.status ? pricingStructure.status : 'ENABLED']);
                        if (q.affectedRows <= 0) {
                            errors.push(`Unable to update pricing structure id ${pricingStructure.id}`);
                        }
                    }
                }
            }
            return errors;
        });
        fireEvent({
            type: "AddOrUpdatePricingStructuresEvent",
            pricingStructures, errors
        } as AddOrUpdatePricingStructuresEvent);
        return errors;
    };


    /**
     *  ======================================================
     *  === getPricingStructuresByView ===
     *  ======================================================
     */
    async getPricingStructuresByView(viewId: number): Promise<PricingStructure[]> {
        const pricingStructures: PricingStructure[] = await doInDbConnection(async (conn: Connection) => {
            const query: QueryA = await conn.query(`
                    SELECT
                        PS.ID AS PS_ID, 
                        PS.VIEW_ID AS PS_VIEW_ID, 
                        PS.NAME AS PS_NAME, 
                        V.NAME AS V_NAME,
                        PS.DESCRIPTION AS PS_DESCRIPTION, 
                        PS.STATUS AS PS_STATUS, 
                        PS.CREATION_DATE AS PS_CREATION_DATE, 
                        PS.LAST_UPDATE AS PS_LAST_UPDATE
                    FROM TBL_PRICING_STRUCTURE AS PS
                    LEFT JOIN TBL_VIEW AS V ON V.ID = PS.VIEW_ID
                    WHERE PS.VIEW_ID=? AND PS.STATUS = 'ENABLED' AND V.STATUS='ENABLED'
                `, [viewId]);

            return query.reduce((pricingStructures: PricingStructure[], i: QueryI) => {
                const pricingStructure: PricingStructure = {
                    id: i.PS_ID,
                    viewId: i.PS_VIEW_ID,
                    name: i.PS_NAME,
                    status: i.PS_STATUS,
                    viewName: i.V_NAME,
                    lastUpdate: i.PS_LAST_UPDATE,
                    description: i.PS_DESCRIPTION,
                    creationDate: i.PS_CREATION_DATE,
                };
                pricingStructures.push(pricingStructure);
                return pricingStructures;
            }, []);
        });
        fireEvent({
            type: "GetPricingStructuresByViewEvent",
            viewId, pricingStructures
        } as GetPricingStructuresByViewEvent);
        return pricingStructures;
    };


    /**
     *  ======================================================
     *  === getPartnerPricingStructures ===
     *  ======================================================
     */
    async getPartnerPricingStructures(userId: number): Promise<PricingStructure[]> {
        const q: QueryA = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                    SELECT  
                        PS.ID AS PS_ID, 
                        PS.VIEW_ID AS PS_VIEW_ID, 
                        PS.NAME AS PS_NAME, 
                        V.NAME AS V_NAME,
                        PS.DESCRIPTION AS PS_DESCRIPTION, 
                        PS.STATUS AS PS_STATUS, 
                        PS.CREATION_DATE AS PS_CREATION_DATE, 
                        PS.LAST_UPDATE AS PS_LAST_UPDATE 
                    FROM TBL_PRICING_STRUCTURE AS PS
                    LEFT JOIN TBL_VIEW AS V ON V.ID = PS.VIEW_ID 
                    WHERE PS.ID IN (
                        SELECT PS.ID
                        FROM TBL_LOOKUP_USER_GROUP AS UG
                        LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS GR ON GR.GROUP_ID = UG.GROUP_ID
                        LEFT JOIN TBL_ROLE AS R ON R.ID = GR.ROLE_ID
                        LEFT JOIN TBL_LOOKUP_PRICING_STRUCTURE_GROUP AS PSG ON PSG.GROUP_ID = UG.GROUP_ID
                        LEFT JOIN TBL_PRICING_STRUCTURE AS PS ON PS.ID = PSG.PRICING_STRUCTURE_ID
                        WHERE UG.USER_ID = ? AND R.NAME = ? AND PS.STATUS = 'ENABLED'
                    ) AND PS.STATUS = 'ENABLED' AND V.STATUS = 'ENABLED'
                `, [userId, ROLE_PARTNER]);

            return q;
        });

        const pricingStructures: PricingStructure[] = q.reduce((acc: PricingStructure[], curr: QueryI) => {
            const v: PricingStructure = {
                id: curr.PS_ID,
                name: curr.PS_NAME,
                status: curr.PS_STATUS,
                viewId: curr.PS_VIEW_ID,
                viewName: curr.V_NAME,
                description: curr.PS_DESCRIPTION,
                creationDate: curr.PS_CREATION_DATE,
                lastUpdate: curr.PS_LAST_UPDATE
            };
            acc.push(v);
            return acc;
        }, []);
        fireEvent({
            type: "GetPartnerPricingStructuresEvent",
            userId, pricingStructures
        } as GetPartnerPricingStructuresEvent);
        return pricingStructures;
    }

    /**
     *  ======================================================
     *  === getAllPricingStructureItemsWithPrice ===
     *  ======================================================
     */
    async getAllPricingStructureItemsWithPriceCount(pricingStructureId: number): Promise<number> {
        return await doInDbConnection(async (conn: Connection) => {
            const qq: QueryA = await conn.query(`
                    SELECT COUNT(*) AS COUNT 
                    FROM TBL_ITEM AS I 
                    WHERE I.STATUS = 'ENABLED' AND I.PARENT_ID IS NULL AND I.VIEW_ID = (
                        SELECT VIEW_ID FROM TBL_PRICING_STRUCTURE WHERE ID = ?
                    )
                `, [pricingStructureId]);
            const total = qq[0].COUNT;
            return total;
        });
    }
    async getAllPricingStructureItemsWithPrice(pricingStructureId: number, limitOffset?: LimitOffset): Promise<PricingStructureItemWithPrice[]> {
        const pricingStructureItemWithPrices: PricingStructureItemWithPrice[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                    SELECT
                        I.ID AS I_ID,
                        I.PARENT_ID AS I_PARENT_ID,
                        I.VIEW_ID AS I_VIEW_ID,
                        I.NAME AS I_NAME,
                        I.DESCRIPTION AS I_DESCRIPTION,
                        I.STATUS AS I_STATUS,
                        
                        PS.ID AS PS_ID,
                        PS.VIEW_ID AS PS_VIEW_ID,
                        PS.NAME AS PS_NAME,
                        PS.DESCRIPTION AS PS_DESCRIPTION,
                        PS.CREATION_DATE AS PS_CREATION_DATE,
                        PS.LAST_UPDATE AS PS_LAST_UPDATE,
                        
                        PSI.ID AS PSI_ID,
                        PSI.ITEM_ID AS PSI_ITEM_ID,
                        PSI.PRICING_STRUCTURE_ID AS PSI_PRICING_STRUCTURE_ID,
                        PSI.PRICE AS PSI_PRICE,
                        PSI.COUNTRY AS PSI_COUNTRY,
                        PSI.CREATION_DATE AS PSI_CREATION_DATE,
                        PSI.LAST_UPDATE AS PSI_LAST_UPDATE
                    
                    FROM TBL_ITEM AS I
                    LEFT JOIN TBL_PRICING_STRUCTURE AS PS ON PS.VIEW_ID = I.VIEW_ID
                    LEFT JOIN TBL_PRICING_STRUCTURE_ITEM AS PSI ON PSI.PRICING_STRUCTURE_ID = PS.ID AND PSI.ITEM_ID = I.ID
                    WHERE PS.ID=? AND I.PARENT_ID IS NULL AND I.STATUS = 'ENABLED' AND PS.STATUS <> 'DELETED'
                    ${LIMIT_OFFSET(limitOffset)}
                `, [pricingStructureId]);

            const mItemMap: Map<string /* itemId */, PricingStructureItemWithPrice> = new Map();
            for (const i of q) {
                const itemId: number = i.I_ID;
                const mItemMapKey: string = `${itemId}`;

                if (!mItemMap.has(mItemMapKey)) {
                    const item: PricingStructureItemWithPrice = {
                        id: i.PSI_ID,
                        itemId: itemId,
                        itemName: i.I_NAME,
                        itemDescription: i.I_DESCRIPTION,
                        parentId: i.I_PARENT_ID,
                        country: i.PSI_COUNTRY,
                        price: i.PSI_PRICE,
                        creationDate: i.PSI_CREATION_DATE,
                        lastUpdate: i.PSI_LAST_UPDATE,
                        children: await getChildrenWithConn(conn, pricingStructureId, itemId)
                    } as PricingStructureItemWithPrice;
                    mItemMap.set(mItemMapKey, item);
                }
            }
            return [...mItemMap.values()];
        });
        fireEvent({
            type: "GetAllPricingStructureItemsWithPriceEvent",
            pricingStructureId, limitOffset, pricingStructureItemWithPrices
        } as GetAllPricingStructureItemsWithPriceEvent);
        return pricingStructureItemWithPrices;
    }



    /**
     *  ======================================================
     *  === getAllPricingStructures ===
     *  ======================================================
     */
    async getAllPricingStructures(): Promise<PricingStructure[]> {
        const pricingStructures: PricingStructure[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                    SELECT 
                        PS.ID AS PS_ID, 
                        PS.VIEW_ID AS PS_VIEW_ID, 
                        PS.NAME AS PS_NAME, 
                        PS.STATUS AS PS_STATUS,
                        V.NAME AS V_NAME,
                        PS.DESCRIPTION AS PS_DESCRIPTION, 
                        PS.CREATION_DATE AS PS_CREATION_DATE, 
                        PS.LAST_UPDATE AS PS_LAST_UPDATE
                    FROM TBL_PRICING_STRUCTURE AS PS
                    LEFT JOIN TBL_VIEW AS V ON V.ID = PS.VIEW_ID 
                    WHERE PS.STATUS <> 'DELETED' AND V.STATUS = 'ENABLED' 
                `, []);

            const pricingStructures: PricingStructure[] = q.reduce((acc: PricingStructure[], i: QueryI) => {

                const pricingStructure: PricingStructure = {
                    id: i.PS_ID,
                    name: i.PS_NAME,
                    status: i.PS_STATUS,
                    viewName: i.V_NAME,
                    viewId: i.PS_VIEW_ID,
                    description: i.PS_DESCRIPTION,
                    creationDate: i.PS_CREATION_DATE,
                    lastUpdate: i.PS_LAST_UPDATE
                } as PricingStructure;
                acc.push(pricingStructure);

                return acc;
            }, []);

            return pricingStructures;
        });
        fireEvent({
            type: "GetAllPricingStructuresEvent",
            pricingStructures
        } as GetAllPricingStructuresEvent);
        return pricingStructures;
    };


    /**
     *  ======================================================
     *  === getPricingStructureByName ===
     *  ======================================================
     */
    async getPricingStructureByName(viewId: number, pricingStructureName: string): Promise<PricingStructure> {
        const pricingStructure: PricingStructure = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                    SELECT 
                        PS.ID AS PS_ID, 
                        PS.VIEW_ID AS PS_VIEW_ID, 
                        PS.NAME AS PS_NAME, 
                        V.NAME AS V_NAME,
                        PS.DESCRIPTION AS PS_DESCRIPTION, 
                        PS.STATUS AS PS_STATUS, 
                        PS.CREATION_DATE AS PS_CREATION_DATE, 
                        PS.LAST_UPDATE AS PS_LAST_UPDATE
                    FROM TBL_PRICING_STRUCTURE AS PS
                    LEFT JOIN TBL_VIEW AS V ON V.ID = PS.VIEW_ID
                    WHERE PS.NAME=? AND V.ID = ? 
                `, [pricingStructureName, viewId]);

            return q.reduce((acc: PricingStructure, i: QueryI) => {
                acc.id = i.PS_ID;
                acc.viewId = i.PS_VIEW_ID;
                acc.name = i.PS_NAME;
                acc.status = i.PS_STATUS;
                acc.viewName = i.V_NAME;
                acc.description = i.PS_DESCRIPTION;
                acc.creationDate = i.PS_CREATION_DATE;
                acc.lastUpdate = i.PS_LAST_UPDATE;
                return acc;
            }, {} as PricingStructure);
        });
        fireEvent({
            type: "GetPricingStructureByNameEvent",
            pricingStructureName, pricingStructure
        } as GetPricingStructureByNameEvent);
        return pricingStructure;
    }


    /**
     *  ======================================================
     *  === getPricingStructureById ===
     *  ======================================================
     */
    async getPricingStructureById(pricingStructureId: number): Promise<PricingStructure> {
        const pricingStructure: PricingStructure = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                    SELECT 
                        PS.ID AS PS_ID, 
                        PS.VIEW_ID AS PS_VIEW_ID, 
                        PS.NAME AS PS_NAME, 
                        V.NAME AS V_NAME,
                        PS.DESCRIPTION AS PS_DESCRIPTION, 
                        PS.STATUS AS PS_STATUS, 
                        PS.CREATION_DATE AS PS_CREATION_DATE, 
                        PS.LAST_UPDATE AS PS_LAST_UPDATE
                    FROM TBL_PRICING_STRUCTURE AS PS
                    LEFT JOIN TBL_VIEW AS V ON V.ID = PS.VIEW_ID
                    WHERE PS.ID=? 
                `, [pricingStructureId]);

            return q.reduce((acc: PricingStructure, i: QueryI) => {
                acc.id = i.PS_ID;
                acc.viewId = i.PS_VIEW_ID;
                acc.name = i.PS_NAME;
                acc.status = i.PS_STATUS;
                acc.viewName = i.V_NAME;
                acc.description = i.PS_DESCRIPTION;
                acc.creationDate = i.PS_CREATION_DATE;
                acc.lastUpdate = i.PS_LAST_UPDATE;
                return acc;
            }, {} as PricingStructure);
        });
        fireEvent({
            type: "GetPricingStructureByIdEvent",
            pricingStructureId, pricingStructure
        } as GetPricingStructureByIdEvent)
        return pricingStructure;
    }
}

const s = new PricingStructureService();
export const
    searchGroupsAssociatedWithPricingStructure = s.searchGroupsAssociatedWithPricingStructure.bind(s),
    searchGroupsNotAssociatedWithPricingStructure = s.searchGroupsNotAssociatedWithPricingStructure.bind(s),
    getPricingStructureGroupAssociations = s.getPricingStructureGroupAssociations.bind(s),
    linkPricingStructureWithGroupId = s.linkPricingStructureWithGroupId.bind(s),
    unlinkPricingStructureWithGroupId = s.unlinkPricingStructureWithGroupId.bind(s),
    updatePricingStructureStatus = s.updatePricingStructureStatus.bind(s),
    addOrUpdatePricingStructures = s.addOrUpdatePricingStructures.bind(s),
    getPricingStructuresByView = s.getPricingStructuresByView.bind(s),
    getPartnerPricingStructures = s.getPartnerPricingStructures.bind(s),
    getAllPricingStructureItemsWithPriceCount = s.getAllPricingStructureItemsWithPriceCount.bind(s),
    getAllPricingStructureItemsWithPrice = s.getAllPricingStructureItemsWithPrice.bind(s),
    getAllPricingStructures = s.getAllPricingStructures.bind(s),
    getPricingStructureByName = s.getPricingStructureByName.bind(s),
    getPricingStructureById = s.getPricingStructureById.bind(s);