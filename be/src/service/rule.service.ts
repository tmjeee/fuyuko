import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {
    Rule2,
    ValidateClause2,
    ValidateClauseMetadata2,
    ValidateClauseMetadataEntry2, WhenClause2, WhenClauseMetadata2, WhenClauseMetadataEntry2
} from "../server-side-model/server-side.model";
import {Rule} from "../model/rule.model";
import {ruleConvert, rulesConvert, rulesRevert} from "./conversion-rule.service";
import {Status} from "../model/status.model";
import {ApiResponse} from "../model/api-response.model";
import {
    AddOrUpdateRuleEvent,
    fireEvent,
    GetRuleEvent,
    GetRulesEvent,
    UpdateRuleStatusEvent
} from "./event/event.service";

const SQL_1 = `
   SELECT
      R.ID AS R_ID,
      R.VIEW_ID AS R_VIEW_ID,
      R.NAME AS R_NAME,
      R.LEVEL AS R_LEVEL,
      R.DESCRIPTION AS R_DESCRIPTION,
      R.STATUS AS R_STATUS,
      
      WC.ID AS WC_ID,
      WC.VIEW_ATTRIBUTE_ID AS WC_VIEW_ATTRIBUTE_ID,
      WC.OPERATOR AS WC_OPERATOR,
      WCA.NAME AS WCA_NAME,
      WCA.DESCRIPTION AS WCA_DESCRIPTION,
      WCA.TYPE AS WCA_TYPE,
      WCM.ID AS WCM_ID,
      WCM.NAME AS WCM_NAME,
      WCME.ID AS WCME_ID,
      WCME.KEY AS WCME_KEY,
      WCME.VALUE AS WCME_VALUE,
      WCME.DATA_TYPE AS WCME_DATA_TYPE,
      
      VC.ID AS VC_ID,
      VC.VIEW_ATTRIBUTE_ID AS VC_VIEW_ATTRIBUTE_ID,
      VC.OPERATOR AS VC_OPERATOR,
      VCA.NAME AS VCA_NAME,
      VCA.DESCRIPTION AS VCA_DESCRIPTION,
      VCA.TYPE AS VCA_TYPE,
      VCM.ID AS VCM_ID,
      VCM.NAME AS VCM_NAME,
      VCME.ID AS VCME_ID,
      VCME.KEY AS VCME_KEY,
      VCME.VALUE AS VCME_VALUE,
      VCME.DATA_TYPE AS VCME_DATA_TYPE
   
   FROM TBL_RULE AS R
   LEFT JOIN TBL_RULE_VALIDATE_CLAUSE AS VC ON VC.RULE_ID = R.ID
   LEFT JOIN TBL_VIEW_ATTRIBUTE AS VCA ON VCA.ID = VC.VIEW_ATTRIBUTE_ID
   LEFT JOIN TBL_RULE_VALIDATE_CLAUSE_METADATA AS VCM ON RULE_VALIDATE_CLAUSE_ID = VC.ID
   LEFT JOIN TBL_RULE_VALIDATE_CLAUSE_METADATA_ENTRY AS VCME ON RULE_VALIDATE_CLAUSE_METADATA_ID = VCM.ID
   LEFT JOIN TBL_RULE_WHEN_CLAUSE AS WC ON WC.RULE_ID = R.ID
   LEFT JOIN TBL_VIEW_ATTRIBUTE AS WCA ON WCA.ID = WC.VIEW_ATTRIBUTE_ID
   LEFT JOIN TBL_RULE_WHEN_CLAUSE_METADATA AS WCM ON WCM.RULE_WHEN_CLAUSE_ID = WC.ID
   LEFT JOIN TBL_RULE_WHEN_CLAUSE_METADATA_ENTRY AS WCME ON WCME.RULE_WHEN_CLAUSE_METADATA_ID =WCM.ID
   WHERE R.STATUS <> 'DELETED' AND R.VIEW_ID = ?
`;

const SQL_2 = `${SQL_1} AND R.ID=?`;



// =======================
// === addOrUpdateRule ===
// =======================
// todo: need a type of Rule here to eliminate properties not needed
export const addOrUpdateRules = async (viewId: number, rules: Rule[]): Promise<string[]> => {
    const rule2s: Rule2[] = rulesRevert(rules);
    const errors: string[] = [];
    for (const rule2 of rule2s) {
        if (rule2.id && rule2.id > 0)  { // update
            const errs: string[] = await doInDbConnection(async (conn: Connection) => {
                const err: string[] = await _ruleUpdate(conn, viewId, rule2)
                return err;
            });
            errors.push(...errs);
        } else { // add
            const errs: string[] = await doInDbConnection(async (conn: Connection) => {
                const err: string [] = await _ruleAdd(conn, viewId, rule2)
                return err;
            });
            errors.push(...errs);
        }
    }
    fireEvent({
       type: "AddOrUpdateRuleEvent",
       rules, errors
    } as AddOrUpdateRuleEvent);
    return errors;
};

const _ruleAdd = async (conn: Connection, viewId: number, rule2: Rule2) => {
    const errors: string[] = [];
    await doInDbConnection(async (conn: Connection) => {

        const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_RULE WHERE NAME=? AND VIEW_ID=?`, [rule2.name, viewId]);
        if (qq[0].COUNT > 0) { // rule with similar name already exists
            errors.push(`Rule with name ${rule2.name} already exists in view id ${viewId}`);
            return;
        }


        const rq: QueryResponse = await conn.query(`INSERT INTO TBL_RULE (VIEW_ID, NAME, DESCRIPTION, STATUS, LEVEL) VALUES (?,?,?,'ENABLED',?)`, [viewId, rule2.name, rule2.description, rule2.level ? rule2.level : 'ERROR']);
        const ruleId: number = rq.insertId;

        for (const validateClause of rule2.validateClauses) {
            const rc: QueryResponse = await conn.query(`INSERT INTO TBL_RULE_VALIDATE_CLAUSE (RULE_ID, VIEW_ATTRIBUTE_ID, \`OPERATOR\`, \`CONDITION\`) VALUES (?,?,?,'')`, [ruleId, validateClause.attributeId, validateClause.operator]);
            const clauseId: number = rc.insertId;

            for (const metadata of validateClause.metadatas) {

                const rm: QueryResponse = await conn.query(`INSERT INTO TBL_RULE_VALIDATE_CLAUSE_METADATA (RULE_VALIDATE_CLAUSE_ID, NAME) VALUES (?, '')`, [clauseId]);
                const metaId: number = rm.insertId;

                for (const entry of metadata.entries) {
                    await conn.query(`INSERT INTO TBL_RULE_VALIDATE_CLAUSE_METADATA_ENTRY (RULE_VALIDATE_CLAUSE_METADATA_ID, \`KEY\`, \`VALUE\`, DATA_TYPE) VALUES (?,?,?,?)`, [metaId, entry.key, entry.value, entry.dataType]);
                }
            }
        }

        for (const whenClause of rule2.whenClauses) {
            const rc: QueryResponse = await conn.query(`INSERT INTO TBL_RULE_WHEN_CLAUSE (RULE_ID, VIEW_ATTRIBUTE_ID, \`OPERATOR\`, \`CONDITION\`) VALUES (?,?,?,'')`, [ruleId, whenClause.attributeId, whenClause.operator]);
            const clauseId: number = rc.insertId;

            for (const metadata of whenClause.metadatas) {

                const rm: QueryResponse = await conn.query(`INSERT INTO TBL_RULE_WHEN_CLAUSE_METADATA (RULE_WHEN_CLAUSE_ID, NAME) VALUES (?, '')`, [clauseId]);
                const metaId: number = rm.insertId;

                for (const entry of metadata.entries) {
                    await conn.query(`INSERT INTO TBL_RULE_WHEN_CLAUSE_METADATA_ENTRY (RULE_WHEN_CLAUSE_METADATA_ID, \`KEY\`, \`VALUE\`, DATA_TYPE) VALUES (?,?,?,?)`, [metaId, entry.key, entry.value, entry.dataType]);
                }
            }
        }
    });
    return errors;
}

const _ruleUpdate = async (conn: Connection, viewId: number, rule2: Rule2) => {
    const errors: string[] = [];
    await doInDbConnection(async (conn: Connection) => {

        const ruleId: number = rule2.id;

        const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_RULE WHERE ID=?`, [ruleId]);
        if (qq[0].COUNT <= 0) { // no such rule with id exists, cannot update rule that do not exists
            errors.push(`Rule with id ${ruleId} do not exists`);
            return;
        }

        await conn.query(`UPDATE TBL_RULE SET NAME=?, DESCRIPTION=?, LEVEL=? WHERE ID=?`, [rule2.name, rule2.description, rule2.level, ruleId]);

        await conn.query(`DELETE FROM TBL_RULE_VALIDATE_CLAUSE WHERE RULE_ID=?`, [ruleId]);

        for (const validateClause of rule2.validateClauses) {

            const rc: QueryResponse = await conn.query(`INSERT INTO TBL_RULE_VALIDATE_CLAUSE (RULE_ID, VIEW_ATTRIBUTE_ID, \`OPERATOR\`, \`CONDITION\`) VALUES (?,?,?,'')`, [ruleId, validateClause.attributeId, validateClause.operator]);
            const clauseId: number = rc.insertId;

            for (const metadata of validateClause.metadatas) {

                const rm: QueryResponse = await conn.query(`INSERT INTO TBL_RULE_VALIDATE_CLAUSE_METADATA (RULE_VALIDATE_CLAUSE_ID, NAME) VALUES (?, '')`, [clauseId]);
                const metaId: number = rm.insertId;

                for (const entry of metadata.entries) {
                    await conn.query(`INSERT INTO TBL_RULE_VALIDATE_CLAUSE_METADATA_ENTRY (RULE_VALIDATE_CLAUSE_METADATA_ID, \`KEY\`, \`VALUE\`, DATA_TYPE) VALUES (?,?,?,?)`, [metaId, entry.key, entry.value, entry.dataType]);
                }
            }
        }

        await conn.query(`DELETE FROM TBL_RULE_WHEN_CLAUSE WHERE RULE_ID=?`, [ruleId]);

        for (const whenClause of rule2.whenClauses) {
            const rc: QueryResponse = await conn.query(`INSERT INTO TBL_RULE_WHEN_CLAUSE (RULE_ID, VIEW_ATTRIBUTE_ID, \`OPERATOR\`, \`CONDITION\`) VALUES (?,?,?,'')`, [ruleId, whenClause.attributeId, whenClause.operator]);
            const clauseId: number = rc.insertId;

            for (const metadata of whenClause.metadatas) {

                const rm: QueryResponse = await conn.query(`INSERT INTO TBL_RULE_WHEN_CLAUSE_METADATA (RULE_WHEN_CLAUSE_ID, NAME) VALUES (?, '')`, [clauseId]);
                const metaId: number = rm.insertId;

                for (const entry of metadata.entries) {
                    await conn.query(`INSERT INTO TBL_RULE_WHEN_CLAUSE_METADATA_ENTRY (RULE_WHEN_CLAUSE_METADATA_ID, \`KEY\`, \`VALUE\`, DATA_TYPE) VALUES (?,?,?,?)`, [metaId, entry.key, entry.value, entry.dataType]);
                }
            }
        }
    });
    return errors;
}




// ==============================
// === updateRuleStatus ===
// ========================
export const updateRuleStatus = async (ruleId: number, status: Status): Promise<boolean> => {
    const result: boolean = await doInDbConnection(async (conn: Connection) => {
        const q: QueryResponse = await conn.query(`UPDATE TBL_RULE SET STATUS = ? WHERE ID = ? `, [status, ruleId]);
        return (q.affectedRows > 0);
    });
    fireEvent({
       type: "UpdateRuleStatusEvent",
       ruleId, status, result
    } as UpdateRuleStatusEvent);
    return result;
};


// ================
// === getRules ===
// ================
export const getRules = async (viewId: number): Promise<Rule[]> => {
    const rule2s: Rule2[] = await getRule2s(viewId);
    const rules: Rule[] = rulesConvert(rule2s);
    fireEvent({
       type: "GetRulesEvent",
       viewId, rules
    } as GetRulesEvent);
    return rules;
};
export const getRule2s = async (viewId: number): Promise<Rule2[]>  => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_1, [viewId]);
        return p(q);
    });

};



// ================
// === getRule ===
// ================
export const getRule = async (viewId: number, ruleId: number): Promise<Rule> => {
    const rule2: Rule2 = await getRule2(viewId, ruleId);
    const rule: Rule = ruleConvert(rule2);
    fireEvent({
        type: "GetRuleEvent",
        viewId, ruleId, rule
    } as GetRuleEvent);
    return rule;
};
export const getRule2 = async (viewId: number, ruleId: number): Promise<Rule2> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_2, [viewId, ruleId]);
        const rs: Rule2[] = p(q);
        if (rs.length > 0) {
            return rs[0];
        }
        return null;
    });
}


// ================================ misc, helper functions =======================================
export const p = (q: QueryA): Rule2[] => {
    const rMap:     Map<string /* ruleId */,                                        Rule2> = new Map();
    const vcMap:    Map<string /* ruleId_validationClauseId */,                     ValidateClause2> = new Map();
    const vcmMap:   Map<string /* ruleId_validationClauseId_metaId */,              ValidateClauseMetadata2> = new Map();
    const vcmeMap:  Map<string /* ruleId_validationClauseId_metaId_entryId */,      ValidateClauseMetadataEntry2> = new Map();
    const wcMap:    Map<string /* ruleId_whenClauseId */,                           ValidateClause2> = new Map();
    const wcmMap:   Map<string /* ruleId_whenClauseId_metaId */,                    ValidateClauseMetadata2> = new Map();
    const wcmeMap:  Map<string /* ruleId_whenClauseId_metaId_entryId */,            ValidateClauseMetadataEntry2> = new Map();

    const rule2s: Rule2[] = q.reduce((acc: Rule2[], i: QueryI) => {

        const ruleId: number = i.R_ID;
        const rMapKey: string = `${ruleId}`;
        if (!rMap.has(rMapKey)) {
            const r = {
                id: ruleId,
                name: i.R_NAME,
                description: i.R_DESCRIPTION,
                status: i.R_STATUS,
                level: i.R_LEVEL,
                whenClauses: [],
                validateClauses: []
            } as Rule2;
            rMap.set(rMapKey, r);
            acc.push(r);
        }

        const vcId: number = i.VC_ID;
        const vcMapKey: string = `${ruleId}_${vcId}`;
        if (!vcMap.has(vcMapKey)) {
            const vc  = {
                id: vcId,
                operator: i.VC_OPERATOR,
                attributeId: i.VC_VIEW_ATTRIBUTE_ID,
                attributeName: i.VCA_NAME,
                attributeType: i.VCA_TYPE,
                metadatas: []
            } as ValidateClause2;
            vcMap.set(vcMapKey, vc);
            rMap.get(rMapKey).validateClauses.push(vc);
        }

        const vcmId: number = i.VCM_ID;
        const vcmMapKey: string = `${ruleId}_${vcId}_${vcmId}`;
        if (!vcmMap.has(vcmMapKey)) {
            const vcm = {
                id: vcmId,
                name: i.VCM_NAME,
                entries: []
            } as ValidateClauseMetadata2;
            vcmMap.set(vcmMapKey, vcm);
            vcMap.get(vcMapKey).metadatas.push(vcm);
        }

        const vcmeId: number = i.VCME_ID;
        const vcmeMapKey: string = `${ruleId}_${vcId}_${vcmId}_${vcmeId}`;
        if (!vcmeMap.has(vcmeMapKey)) {
            const vcme = {
                id: vcmeId,
                key: i.VCME_KEY,
                value: i.VCME_VALUE,
                dataType: i.VCME_DATA_TYPE
            } as ValidateClauseMetadataEntry2;
            vcmeMap.set(vcmeMapKey, vcme);
            vcmMap.get(vcmMapKey).entries.push(vcme);
        }

        const wcId: number = i.WC_ID;
        const wcMapKey: string = `${ruleId}_${wcId}`;
        if (!wcMap.has(wcMapKey)) {
            const wc = {
                id: wcId,
                attributeId: i.WC_VIEW_ATTRIBUTE_ID,
                attributeName: i.WCA_NAME,
                attributeType: i.WCA_TYPE,
                operator: i.WC_OPERATOR,
                metadatas: []
            } as WhenClause2;
            wcMap.set(wcMapKey, wc);
            rMap.get(rMapKey).whenClauses.push(wc);
        }

        const wcmId: number = i.WCM_ID;
        const wcmMapKey: string = `${ruleId}_${wcId}_${wcmId}`;
        if (!wcmMap.has(wcmMapKey)) {
            const wcm = {
                id: wcmId,
                name: i.WCM_NAME,
                entries: []
            } as WhenClauseMetadata2;
            wcmMap.set(wcmMapKey, wcm);
            wcMap.get(wcMapKey).metadatas.push(wcm);
        }

        const wcmeId: number = i.WCME_ID;
        const wcmeMapKey: string = `${ruleId}_${wcId}_${wcmId}_${wcmeId}`;
        if (!wcmeMap.has(wcmeMapKey)) {
            const wcme = {
                id: wcmeId,
                key: i.WCME_KEY,
                value: i.WCME_VALUE,
                dataType: i.WCME_DATA_TYPE
            } as WhenClauseMetadataEntry2;
            wcmeMap.set(wcmeMapKey, wcme);
            wcmMap.get(wcmMapKey).entries.push(wcme);
        }

        return acc;
    }, []);

    return rule2s;
}
