import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check, body} from 'express-validator';
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {Rule} from "../../model/rule.model";
import {Rule2} from "../../server-side-model/server-side.model";
import {ApiResponse} from "../../model/api-response.model";
import {rulesRevert} from "../../service/conversion-rule.service";
import {ROLE_EDIT} from "../../model/role.model";

// CHECKED

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric(),
        body('rules').isArray(),
        body('rules.*.name').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const rules: Rule[] = req.body.rules;
        const rule2s: Rule2[] = rulesRevert(rules);
        const errors: string[] = [];
        
        for (const rule2 of rule2s) {
            if (rule2.id && rule2.id > 0)  { // update
                await doInDbConnection(async (conn: Connection) => {
                    const err: string[] = await update(conn, viewId, rule2)
                    errors.push(...err);
                });
            } else { // add
                await doInDbConnection(async (conn: Connection) => {
                    const err: string [] = await add(conn, viewId, rule2)
                    errors.push(...err);
                });
            }
        }

        if (errors && errors.length) {
            res.status(200).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Update successful`
            } as ApiResponse);
        }
    }
];

const add = async (conn: Connection, viewId: number, rule2: Rule2): Promise<string[]> => {
    const errors: string[] = [];
    await doInDbConnection(async (conn: Connection) => {

            const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_RULE WHERE NAME=? AND VIEW_ID=?`, [rule2.name, viewId]);
            if (qq[0].COUNT > 0) { // rule with similar name already exists
                errors.push(`Rule with name ${rule2.name} already exists in view id ${viewId}`);
                return;
            }


            const rq: QueryResponse = await conn.query(`INSERT INTO TBL_RULE (VIEW_ID, NAME, DESCRIPTION, STATUS) VALUES (?,?,?,'ENABLED')`, [viewId, rule2.name, rule2.description]);
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
};

const update = async (conn: Connection, viewId: number, rule2: Rule2): Promise<string[]> => {
    const errors: string[] = [];
    await doInDbConnection(async (conn: Connection) => {

        const ruleId: number = rule2.id;

        const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_RULE WHERE ID=?`, [ruleId]);
        if (qq[0].COUNT < 0) { // no such rule with id exists, cannot update rule that do not exists
            errors.push(`Rule with id ${ruleId} do not exists`);
            return;
        }

        await conn.query(`UPDATE TBL_RULE SET NAME=?, DESCRIPTION=? WHERE ID=?`, [rule2.name, rule2.description, ruleId]);

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
};


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/rules`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
