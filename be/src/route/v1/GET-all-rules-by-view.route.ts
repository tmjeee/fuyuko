import {NextFunction, Router, Request, Response } from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {Rule} from "../../model/rule.model";
import {
    Rule2,
    ValidateClause2,
    ValidateClauseMetadata2,
    ValidateClauseMetadataEntry2, WhenClause2, WhenClauseMetadata2, WhenClauseMetadataEntry2
} from "../model/server-side.model";
import {convert} from "../../service/rule-conversion.service";

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);

        await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT
                   R.ID AS R_ID,
                   R.VIEW_ID AS R_VIEW_ID,
                   R.NAME AS R_NAME,
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
            `, [viewId]);

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

            //res.status(200).json(rule2s);
            const rules: Rule[] = convert(rule2s);
            res.status(200).json(rules);
        });
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/rules`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
