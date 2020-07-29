import {Level} from "../../model/level.model";
import {doInDbConnection, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {getAllItem2sInView} from "../item.service";
import {getValidationByViewIdAndValidationId} from "./validation.service";
import {Validation} from "../../model/validation.model";
import {Attribute2, Item2, ItemMetadata2, Rule2} from "../../server-side-model/server-side.model";
import {
    AreaValue,
    CurrencyValue, DATE_FORMAT,
    DateValue, DimensionValue, DoubleSelectValue, HeightValue,
    Item,
    ItemValTypes,
    NumberValue, SelectValue,
    StringValue,
    TextValue,
    Value, VolumeValue, WeightValue, WidthValue
} from "../../model/item.model";
import * as itemConverter from "../conversion-item.service";
import * as ruleConverter from "../conversion-rule.service";
import * as attributeConverter from "../conversion-attribute.service";
import {getRule2s} from "../rule.service";
import {Rule, WhenClause} from "../../model/rule.model";
import {OPERATORS_WITHOUT_CONFIGURATBLE_VALUES, OperatorType} from "../../model/operator.model";
import {getAttribute2sInView} from "../attribute.service";
import {Attribute} from "../../model/attribute.model";
import moment from 'moment';
import * as logger from '../../logger';
import {convertToDebugString, convertToDebugStrings} from "../../shared-utils/ui-item-value-converters.util";
import {getViewById} from "../view.service";
import {View} from "../../model/view.model";
import {CustomRule, CustomRuleForView} from "../../model/custom-rule.model";
import {getAllCustomRulesForView} from "../custom-rule.service";
import {runCustomRule} from "../../custom-rule";
import {
    compareArea,
    compareCurrency,
    compareDate, compareDimension, compareDoubleselect, compareHeight,
    compareNumber, compareSelect,
    compareString,
    compareVolume, compareWeight, compareWidth
} from "../compare-attribute-values.service";
import {createNewItemValue} from "../../shared-utils/ui-item-value-creator.utils";
import {fireEvent, ValidationEvent} from "../event/event.service";


/**
 * ==========================
 * === scheduleValidation ===
 * ==========================
 */
export interface ScheduleValidationResult { validationId: number, errors: string[] };
export const scheduleValidation = async (viewId: number, name: string, description: string):Promise<ScheduleValidationResult> => {
    const r: {validationId: number, errors: string[]} = await doInDbConnection(async (conn: Connection) => {
        let validationId: number = null;
        const errors: string[] = [];
        const q: QueryResponse = await conn.query(`
            
                INSERT INTO TBL_VIEW_VALIDATION (VIEW_ID, NAME, DESCRIPTION, PROGRESS) VALUES (?,?,?,?)
            `, [viewId, name, description, 'SCHEDULED']);

        if (q.affectedRows <= 0) {
           errors.push(`Failed to insert view validation`);
        } else {
            validationId = q.insertId;
        }
        return  {
            errors, validationId
        };
    });
    
    fireEvent({
       type: "ValidationEvent",
       state: "Schedule",
       scheduleValidationResult: r,
       validationId: r.validationId
    } as ValidationEvent); 
    
    if (r.validationId && (!r.errors || !r.errors.length)) {
        runValidation(viewId, r.validationId);
    }
    return r;
};

/**
 * ================================
 * === runValidation ===
 * ================================
 */
export const runValidation = async (viewId: number, validationId: number) => {
    try {
       await doInDbConnection(async (conn: Connection) => {
            await conn.query(`UPDATE TBL_VIEW_VALIDATION SET PROGRESS=?, TOTAL_ITEMS=0 WHERE ID=?`, ['IN_PROGRESS', validationId]);
       });

        await _runPredefinedRulesValidation(viewId, validationId);
        await _runCustomRulesValidation(viewId, validationId);

        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`UPDATE TBL_VIEW_VALIDATION SET PROGRESS=? WHERE ID=?`, ['COMPLETED', validationId]);
        });

        fireEvent({
            type: "ValidationEvent",
            state: "Completed",
            validationId 
        } as ValidationEvent);

    } catch (err) {
        logger.e(`${err.toString()}`, err);

        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`UPDATE TBL_VIEW_VALIDATION SET PROGRESS=? WHERE ID=?`, ['FAILED', validationId]);
        });

        fireEvent({
            type: "ValidationEvent",
            state: "Failed",
            validationId
        } as ValidationEvent);
    }
};


// ======== helpers ===============

const _runCustomRulesValidation = async (viewId: number, validationId: number) => {

    let currentContext = {
        validationId,
    } as Context;

    await i(currentContext, `Running Custom Rule validations for viewId ${viewId} validationId ${validationId}`);

    const view: View = await getViewById(viewId);
    await i(currentContext, `Successfully retrieve view with id ${viewId}`);

    const v: Validation = await getValidationByViewIdAndValidationId(viewId, validationId);
    await i(currentContext, `Successfully retrieved validation for validationId ${validationId}`);

    const a2s: Attribute2[] = await getAttribute2sInView(viewId);
    const as: Attribute[] = await attributeConverter.attributesConvert(a2s);
    await i(currentContext,`Successfully retrieved attributes for viewId ${viewId}`);

    const item2s: Item2[] = await getAllItem2sInView(viewId);
    const items: Item[] = itemConverter.itemsConvert(item2s);
    await i(currentContext, `Successfully retrieved all items for viewId ${viewId}`);

    const customRules: CustomRuleForView[] = await getAllCustomRulesForView(viewId);
    await i(currentContext, `Successfully retrieved all custom rules for viewId ${viewId}`);

    const rule2s: Rule2[] = await getRule2s(viewId);
    const rules: Rule[] = ruleConverter.rulesConvert(rule2s);
    await i(currentContext, `Successfully retrieved all rules for viewId ${viewId}`);

    const l = async (msg: string) => {
       await i(currentContext, msg);
    };

    for(const customRule of customRules) {
        currentContext.rule = customRule;
        currentContext.errornousMessages = [];
        await i(currentContext, `Running against custom rule with id ${customRule.id} named ${customRule.name}`);
        await runCustomRule(customRule, validationId, view, as, items, l);
    }
}

const _runPredefinedRulesValidation = async (viewId: number, validationId: number) => {
    let currentContext = {
        validationId,
    } as Context;

    await i(currentContext, `Running Predefined Rules validations for viewId ${viewId} validationId ${validationId}`);

    const v: Validation = await getValidationByViewIdAndValidationId(viewId, validationId);
    await i(currentContext, `Successfully retrieved validation for validationId ${validationId}`);

    const a2s: Attribute2[] = await getAttribute2sInView(viewId);
    const as: Attribute[] = await attributeConverter.attributesConvert(a2s);
    await i(currentContext,`Successfully retrieved attributes for viewId ${viewId}`);

    const item2s: Item2[] = await getAllItem2sInView(viewId);
    const items: Item[] = itemConverter.itemsConvert(item2s);
    await i(currentContext, `Successfully retrieved all items for viewId ${viewId}`);

    const rule2s: Rule2[] = await getRule2s(viewId);
    const rules: Rule[] = ruleConverter.rulesConvert(rule2s);
    await i(currentContext, `Successfully retrieved all rules for viewId ${viewId}`);


    for (const item of items) {

        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`UPDATE TBL_VIEW_VALIDATION SET TOTAL_ITEMS=? WHERE ID=?`, [items.length, validationId]);
        });


        currentContext.item = item;
        for (const rule of rules) {
            currentContext.rule = rule;
            currentContext.errornousMessages = [];
            let wr  = true;
            await i(currentContext, `Validating itemId ${item.id} against ruleId ${rule.id} in viewId ${viewId}`);
            for (const whenClause of rule.whenClauses) {
                const att: Attribute = as.find((a: Attribute) => a.id === whenClause.attributeId);
                const value: Value = item[whenClause.attributeId];
                const i1: ItemValTypes = value ? value.val : createNewItemValue(att).val;
                const i2: ItemValTypes[] = whenClause.condition;
                const op: OperatorType = whenClause.operator;
                currentContext.attribute = att;

                await i(currentContext,
                    `Validating WhenClause ${whenClause.id} 
                           (attributeId ${whenClause.attributeId} attributeName ${whenClause.attributeName} 
                           whenClause condition ${convertToDebugStrings(whenClause.condition)}
                           op ${whenClause.operator} 
                           against itemValueTypes ${convertToDebugStrings(whenClause.condition)})
                           for itemId ${item.id} against ruleId ${rule.id} in viewId ${viewId}`);

                const tmp = matchs(currentContext, att, i1 /* actual value of item attribute */, i2 /* whenClause conditions value types */, op);
                wr = wr && tmp;

                await i(currentContext,
                    `Validated current WhenClause result is [${tmp}] overall WhenClause result is [${wr}] for WhenClause ${whenClause.id} 
                           (attributeId ${whenClause.attributeId} attributeName ${whenClause.attributeName} 
                           whenClause condition ${convertToDebugStrings(whenClause.condition)}
                           op ${whenClause.operator} 
                           against itemValueTypes ${convertToDebugStrings(whenClause.condition)})
                           for itemId ${item.id} against ruleId ${rule.id} in viewId ${viewId}`);
            }

            if (!wr) {
                await i(currentContext, `WhenClauses for ruleId ${rule.id} on itemId ${item.id} is false, this rule will be skipped `);
            }
            if (wr) { // whenClause evaluates to true, need to do validation

                let vr = true;

                for (const validateClause of rule.validateClauses) {
                    const att: Attribute = as.find((a: Attribute) => a.id === validateClause.attributeId);
                    const value: Value = item[validateClause.attributeId];
                    const i1: ItemValTypes = value ? value.val : createNewItemValue(att).val;
                    const i2: ItemValTypes[] = validateClause.condition;
                    const op: OperatorType = validateClause.operator;
                    currentContext.attribute = att;


                    await i(currentContext,
                        `Validating ValidateClause ${validateClause.id} 
                           (attributeId ${validateClause.attributeId} attributeName ${validateClause.attributeName} op ${validateClause.operator} 
                           against itemValueTypes ${convertToDebugStrings(validateClause.condition)})
                           for itemId ${item.id} against ruleId ${rule.id} in viewId ${viewId}`);

                    const tmp = matchs(currentContext, att, i1 /* actual item attribute value */, i2 /* validateClause conditions value types */, op);
                    if (!tmp) { // this validation failed
                       currentContext.errornousMessages.push({
                           rule,
                           attribute: att,
                           item,
                           message: `Attribute ${att.name} (${att.id}) value ${convertToDebugString(i1)} ${op} ${convertToDebugStrings(i2)} FAILED `
                       });
                    }

                    vr = vr && tmp;

                    await i(currentContext,
                        `Validated current ValidateClause result is [${tmp}] overall ValidateClause result is [${wr}] for ValidateClause ${validateClause.id} 
                           (attributeId ${validateClause.attributeId} attributeName ${validateClause.attributeName} 
                           validateClause condition ${convertToDebugStrings(validateClause.condition)} 
                           op ${validateClause.operator} 
                           against itemValueTypes ${convertToDebugStrings(validateClause.condition)})
                           for itemId ${item.id} against ruleId ${rule.id} in viewId ${viewId}`);
                }

                if (vr) {
                    await i(currentContext, `ValidateClauses for ruleId ${rule.id} on itemId ${item.id} is true`);
                    await i(currentContext, `ItemId ${item.id} pass ruleId ${rule.id} validation`);
                }
                if (!vr) { // validateClause is false (failed validation)
                    await i(currentContext, `ValidateClauses for ruleId ${rule.id} on itemId ${item.id} is FALSE`);
                    await i(currentContext, `ItemId ${item.id} FAILED ruleId ${rule.id} validation, error will be logged in db`);
                    await doInDbConnection(async (conn: Connection) => {

                        // insert error messages
                        for (const msg of currentContext.errornousMessages) {
                            const qry2: QueryResponse = await conn.query(`
                                INSERT INTO TBL_VIEW_VALIDATION_ERROR (VIEW_VALIDATION_ID, RULE_ID, ITEM_ID, VIEW_ATTRIBUTE_ID, MESSAGE, LEVEL) VALUES (?,?,?,?,?,?)
                            `, [validationId, msg.rule.id, msg.item.id, msg.attribute.id, msg.message, rule.level]);
                        }
                    });
                }
            }
        }
    }
};

const i = async (context: Context, msg: string) => { await log(context, 'INFO', msg); }
const w = async (context: Context, msg: string) => { await log(context, 'WARN', msg); }
const d = async (context: Context, msg: string) => { await log(context, 'DEBUG', msg); }
const e = async (context: Context, msg: string) => { await log(context, 'ERROR', msg); }
const log = async (context: Context, level: Level, msg: string) => {
    const m = `[validationId=${context.validationId}]
             [itemId=${context.item ? context.item.id : 'unknown'}]
             [attributeId=${context.attribute ? context.attribute.id : 'unknown'}] 
             - ${msg}`;
    switch (level) {
        case "DEBUG":
            logger.d(msg);
            break;
        case "ERROR":
            logger.e(msg);
            break;
        case "INFO":
            logger.i(msg);
            break;
        case "WARN":
            logger.w(msg);
            break;
    }
    await doInDbConnection(async (conn: Connection) => {
        await conn.query(`
            INSERT INTO TBL_VIEW_VALIDATION_LOG (VIEW_VALIDATION_ID, LEVEL, MESSAGE) VALUES (?,?,?)
        `, [context.validationId, level, m]);
    })
}

interface Context {
    validationId: number;
    attribute?: Attribute;
    item?: Item;
    rule?: Rule | CustomRule;
    errornousMessages: {rule: Rule | CustomRule, item: Item, attribute: Attribute, message: string}[];
}

const matchs = (context: Context, attribute: Attribute, actualItemAttributeValueType: ItemValTypes, conditionValueTypes: ItemValTypes[], op: OperatorType): boolean => {
    let r = true;
    for (const i of conditionValueTypes) {
        r = r && match(context, attribute, actualItemAttributeValueType, i, op);
    }
    return r;
}

const match = (context: Context, attribute: Attribute, actualItemAttributeValueType: ItemValTypes, conditionValueType: ItemValTypes, op: OperatorType): boolean => {

    if (!OPERATORS_WITHOUT_CONFIGURATBLE_VALUES.includes(op) &&
        actualItemAttributeValueType.type !== conditionValueType.type) {
        // cannot compare value of different types
        return false;
    }

    switch (actualItemAttributeValueType.type) {
        case "length":
            break;
        case 'string': {
            const a1 = actualItemAttributeValueType as StringValue;
            const a2 = conditionValueType as StringValue;

            try {
                return compareString(a2.value, a1.value, op);
            } catch(e) {
                e(context, `operator of type ${op} is not defined`);
                return false;
            }
        }
        case 'text': {
            const a1 = actualItemAttributeValueType as TextValue;
            const a2 = conditionValueType as TextValue;

            try {
                return compareString(a2.value, a1.value, op);
            } catch(e) {
                e(context, `operator of type ${op} is not defined`);
                return false;
            }
        }
        case 'number': {
            const a1 = actualItemAttributeValueType as NumberValue;
            const a2 = conditionValueType as NumberValue;
            try {
                return compareNumber(a2.value, a1.value, op);
            } catch(e) {
                e(context,`operator of type ${op} is not defined`);
                return false;
            }
        }
        case 'date': {
            const a1 = actualItemAttributeValueType as DateValue;
            const a2 = conditionValueType as DateValue;
            const format: string = attribute.format ? attribute.format : DATE_FORMAT;
            const m1: moment.Moment = moment(a1.value, format);
            const m2: moment.Moment = a2 ? moment(a2.value, format) : null;

            try {
                return compareDate(m2, m1, op);
            } catch (e) {
                e(context,`operator of type ${op} is not defined`);
                return false;
            }
        }
        case 'currency': {
            const a1 = actualItemAttributeValueType as CurrencyValue;
            const a2 = conditionValueType as CurrencyValue;
            if (a2 && a1.country !== a2.country) {
                return false;
            }
            try {
                return compareCurrency(a2.value, a2.country, a1.value, a1.country, op);
            } catch (e) {
                e(context,`operator of type ${op} is not defined`);
                return false;
            }
        }
        case 'volume': {
            const a1 = actualItemAttributeValueType as VolumeValue;
            const a2 = conditionValueType as VolumeValue;

            if (a2 && a1.unit !== a2.unit) {
                return false;
            }
            try {
                return compareVolume(a2.value, a2.unit, a1.value, a1.unit, op);
            } catch (e) {
                e(context,`operator of type ${op} is not defined`);
                return false;
            }
        }
        case 'dimension': {
            const a1 = actualItemAttributeValueType as DimensionValue;
            const a2 = conditionValueType as DimensionValue;

            if (a2 && a1.unit !== a2.unit) {
                return false;
            }
            try {
                return compareDimension(a2.length, a2.width, a2.height, a2.unit, a1.length, a1.width, a1.height, a1.unit, op);
            } catch (e) {
                e(context,`operator of type ${op} is not defined`);
                return false;
            }
        }
        case 'area': {
            const a1 = actualItemAttributeValueType as AreaValue;
            const a2 = conditionValueType as AreaValue;

            if (a2 && a1.unit !== a2.unit) {
                return false;
            }
            try {
                return compareArea(a2.value, a2.unit, a1.value, a1.unit, op);
            } catch (e) {
                e(context,`operator of type ${op} is not defined`);
                return false;
            }
        }
        case 'width': {
            const a1 = actualItemAttributeValueType as WidthValue;
            const a2 = conditionValueType as WidthValue;


            if (a2 && a1.unit !== a2.unit) {
                return false;
            }
            try {
                return compareWidth(a2.value, a2.unit, a1.value, a1.unit, op);
            } catch (e) {
                e(context,`operator of type ${op} is not defined`);
                return false;
            }
        }
        case 'height': {
            const a1 = actualItemAttributeValueType as HeightValue;
            const a2 = conditionValueType as HeightValue;


            if (a2 && a1.unit !== a2.unit) {
                return false;
            }
            try {
                return compareHeight(a2.value, a2.unit, a1.value, a1.unit, op);
            } catch (e) {
                e(context,`operator of type ${op} is not defined`);
                return false;
            }
        }
        case 'weight': {
            const a1 = actualItemAttributeValueType as WeightValue;
            const a2 = conditionValueType as WeightValue;


            if (a2 && a1.unit !== a2.unit) {
                return false;
            }
            try {
                return compareWeight(a2.value, a2.unit, a1.value, a1.unit, op);
            } catch (e) {
                e(context,`operator of type ${op} is not defined`);
                return false;
            }
        }
        case 'select': {
            const a1 = actualItemAttributeValueType as SelectValue;
            const a2 = conditionValueType as SelectValue;

            try {
                return compareSelect(a2.key, a1.key, op);
            } catch (e) {
                e(context,`operator of type ${op} is not defined`);
                return false;
            }
        }
        case 'doubleselect': {
            const a1 = actualItemAttributeValueType as DoubleSelectValue;
            const a2 = conditionValueType as DoubleSelectValue;

            try {
                return compareDoubleselect(a2.key1, a2.key2, a1.key1, a1.key2, op);
            } catch (e) {
                e(context,`operator of type ${op} is not defined`);
                return false;
            }
        }
    }
    return false;
};
