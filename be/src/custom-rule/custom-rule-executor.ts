import {i, e} from '../logger';
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import * as semver from 'semver';
import {doInDbConnection, QueryA, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {CustomValidationContext} from '@fuyuko-common/model/validation.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {Item} from '@fuyuko-common/model/item.model';
import {View} from '@fuyuko-common/model/view.model';
import {CustomRule, RuleScript} from '@fuyuko-common/model/custom-rule.model';


const createCustomValidationContext = async (validationId: number, customRuleId: number, view: View, item: Item, attributes: Attribute[]): Promise<CustomValidationContext> => {
    return {
        itemId: (): number => {
            return item.id;
        },
        viewId: (): number => {
            return view.id;
        },
        validationId: (): number => {
            return validationId;
        },
        log: async (msg: string): Promise<void> => {
            await doInDbConnection(async (conn: Connection) => {
                conn.query(`
                    INSERT INTO TBL_VIEW_VALIDATION_LOG (VIEW_VALIDATION_ID, LEVEL, MESSAGE) VALUES (?,'INFO',?)
                `, [validationId, msg]);
            });
        },
        reportError: async (attributeId: number, message: string): Promise<void> => {
            await doInDbConnection((conn: Connection) => {
                conn.query(`
                    INSERT INTO TBL_VIEW_VALIDATION_ERROR (VIEW_VALIDATION_ID, CUSTOM_RULE_ID, ITEM_ID, VIEW_ATTRIBUTE_ID, MESSAGE) VALUES (?,?,?,?,?)
                `, [validationId, customRuleId, item.id, attributeId, message]);
            });
        },
        markFailed: async (): Promise<void> => {
            await doInDbConnection(async (conn: Connection) => {
                await conn.query(`
                    UPDATE TBL_VIEW_VALIDATION SET PROGRESS=? WHERE ID=?
                `, ['FAILED', validationId]);
            });
        },
        markSuccess: async (): Promise<void> => {
            await doInDbConnection(async (conn: Connection) => {
                await conn.query(`
                    UPDATE TBL_VIEW_VALIDATION SET PROGRESS=? WHERE ID=?
                `, ['FAILED', validationId]);
            });
        },
        attribute: (attributeId: number): Attribute => {
            return attributes.find((a: Attribute) => a.id === attributeId);
        },
        item: (): Item => {
            return item;
        },
    } as CustomValidationContext;
}

export const runCustomRule = async (customRule: CustomRule, validationId: number, view: View, attributes: Attribute[], items: Item[], l: (msg: string)=>void) => {
    const ruleName = customRule.name;
    l(`Running custom rule ${ruleName}`);
    const ruleFilePath: string = path.join(__dirname, 'rules', ruleName);
    const exists: boolean = fs.existsSync(ruleFilePath);
    if (!exists) {
        l(`Custom rule file for ${ruleName} do not exists`);
        return;
    }

    const f: RuleScript = await import(ruleFilePath);
    try {
        for (const item of items) {
            try {
                const customValidationContext = await createCustomValidationContext(validationId, customRule.id, view, item, attributes);
                await f.run(customValidationContext);
            } catch (err) {
                e(err.toString(), e);
            }
        }
    } finally {
        l(`End of custom rule ${ruleName} run`);
    }
}

export const runCustomRuleSync = async () => {
    i(`Running custom rule sync ...`);

    const rulesDirPath: string = path.join(__dirname, 'rules');
    const ruleFilesInDir: string[] = await util.promisify(fs.readdir)(rulesDirPath);
    const sortedRuleFilesInDir: string[] = ruleFilesInDir
        .filter((f: string) => f.endsWith('js'))
        .sort((f1: string, f2: string) => semver.compare(f1, f2));

    i(`Custom rules script forward sync, files to db`);
    for (const ruleFile of sortedRuleFilesInDir) {
        const fullRuleFilePath = path.join(__dirname, 'rules', ruleFile);
        const s: RuleScript  = await import(fullRuleFilePath);
        if (!s) {
            continue;
        }
        await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_CUSTOM_RULE WHERE NAME=?`, [ruleFile]);
            if (q[0].COUNT <= 0) { // does not exists in db yet, register it
                const description = (s && s.description) ? s.description() : `no description`;
                await conn.query(`INSERT INTO TBL_CUSTOM_RULE (NAME, DESCRIPTION) VALUES (?,?) `, [ruleFile, description]);
                i(`Created db entry for rule ${ruleFile}`);
            } else {
                i(`Rule file ${ruleFile} already registered before`);
            }
        });
    }

    i(`Custom rules script reverse sync, db to files`);
    await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION FROM TBL_CUSTOM_RULE`);

        for (const qi of q) {
            const name = qi.NAME;
            if (!sortedRuleFilesInDir.includes(name)) { // old entries in db where rule script is missing
                i(`Db rule registry ${name} is outdated, rule script do not exists anymore, removing it from registry`);
                await conn.query(`DELETE FROM TBL_CUSTOM_RULE WHERE ID=?`, [qi.ID]);
            } else {
                i(`Db rule registry ${name} is in sync with rule script, no action required`);
            }
        }
    });

    i(`Done custom rule sync`);
}
