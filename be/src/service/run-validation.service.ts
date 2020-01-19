import {Level} from "../model/level.model";
import {doInDbConnection, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {getAllItemsInView} from "./item.service";
import {getValidationByViewIdAndValidationId, getValidationsByViewId} from "./validation.service";
import {Validation} from "../model/validation.model";
import {Attribute2, Item2, ItemMetadata2, Rule2} from "../route/model/server-side.model";
import {
    AreaValue,
    CurrencyValue,
    DateValue, DimensionValue, DoubleSelectValue, HeightValue,
    Item,
    ItemValTypes,
    NumberValue, SelectValue,
    StringValue,
    TextValue,
    Value, VolumeValue, WidthValue
} from "../model/item.model";
import * as itemConverter from "./conversion-item.service";
import * as ruleConverter from "./conversion-rule.service";
import * as attributeConverter from "./conversion-attribute.service";
import * as itemValueTypesConverter from  './conversion-item-value-types.service';
import {getRule2s} from "./rule.service";
import {Rule, WhenClause} from "../model/rule.model";
import {OPERATORS_WITHOUT_CONFIGURATBLE_VALUES, OperatorType} from "../model/operator.model";
import {getAttributesInView} from "./attribute.service";
import {Attribute, DEFAULT_DATE_FORMAT} from "../model/attribute.model";
import moment from 'moment';
import * as logger from '../logger';
import * as itemValueTypesToString from '../shared-utils/item-val-types-to-string.utils';

interface Context {
   validationId: number;
   attribute?: Attribute;
   item?: Item;
   rule?: Rule;
   errornousMessages: {item: Item, attribute: Attribute, message: string}[];
}

const match = (context: Context, attribute: Attribute, i1: ItemValTypes, i2: ItemValTypes, op: OperatorType): boolean => {

    if (!OPERATORS_WITHOUT_CONFIGURATBLE_VALUES.includes(op) &&
        i1.type !== i2.type) {
        // cannot compare value of different types
        return false;
    }

    switch (i1.type) {
        case "length":
            break;
        case 'string': {
            const a1 = i1 as StringValue;
            const a2 = i2 as StringValue;
            switch (op) {
                case 'eq':
                    return (a1.value == a2.value);
                case 'not eq':
                    return (a1.value !== a2.value);
                case 'lt':
                    return (a1.value < a2.value);
                case 'not lt':
                    return !(a1.value < a2.value);
                case 'gt':
                    return (a1.value > a2.value);
                case 'not gt':
                    return !(a1.value > a2.value);
                case 'gte':
                    return (a1.value >= a2.value);
                case 'not gte':
                    return !(a1.value >= a2.value);
                case 'lte':
                    return (a1.value <= a2.value);
                case 'not lte':
                    return !(a1.value <= a2.value);
                case 'empty':
                    return !!!a1.value;
                case 'not empty':
                    return !!a1.value;
                default:
                    e(context, `operator of type ${op} is not defined`);
                    return false;
            }
        }
        case 'text': {
            const a1 = i1 as TextValue;
            const a2 = i2 as TextValue;
            switch (op) {
                case 'eq':
                    return (a1.value == a2.value);
                case 'not eq':
                    return (a1.value !== a2.value);
                case 'lt':
                    return (a1.value < a2.value);
                case 'not lt':
                    return !(a1.value < a2.value);
                case 'gt':
                    return (a1.value > a2.value);
                case 'not gt':
                    return !(a1.value > a2.value);
                case 'gte':
                    return (a1.value >= a2.value);
                case 'not gte':
                    return !(a1.value >= a2.value);
                case 'lte':
                    return (a1.value <= a2.value);
                case 'not lte':
                    return !(a1.value <= a2.value);
                case 'empty':
                    return !!!a1.value;
                case 'not empty':
                    return !!a1.value;
                default:
                    e(context,`operator of type ${op} is not defined`);
                    return false;
            }
        }
        case 'number': {
            const a1 = i1 as NumberValue;
            const a2 = i2 as NumberValue;
            switch (op) {
                case 'eq':
                    return (a1.value == a2.value);
                case 'not eq':
                    return (a1.value !== a2.value);
                case 'lt':
                    return (a1.value < a2.value);
                case 'not lt':
                    return !(a1.value < a2.value);
                case 'gt':
                    return (a1.value > a2.value);
                case 'not gt':
                    return !(a1.value > a2.value);
                case 'gte':
                    return (a1.value >= a2.value);
                case 'not gte':
                    return !(a1.value >= a2.value);
                case 'lte':
                    return (a1.value <= a2.value);
                case 'not lte':
                    return !(a1.value <= a2.value);
                case 'empty':
                    return !!!a1.value;
                case 'not empty':
                    return !!a1.value;
                default:
                    e(context,`operator of type ${op} is not defined`);
                    return false;
            }
        }
        case 'date': {
            const a1 = i1 as DateValue;
            const a2 = i2 as DateValue;
            const format: string = attribute.format ? attribute.format : DEFAULT_DATE_FORMAT;
            const m1: moment.Moment = moment(a1.value, format);
            const m2: moment.Moment = a2 ? moment(a2.value, format) : null;

            switch (op) {
                case 'eq':
                    return (m1.isSame(m2));
                case 'not eq':
                    return (!m1.isSame(m2));
                case 'lt':
                    return (m1.isBefore(m2));
                case 'not lt':
                    return (!m1.isBefore(m2));
                case 'gt':
                    return (m1.isAfter(m2));
                case 'not gt':
                    return (!m1.isAfter(m2));
                case 'gte':
                    return (m1.isSame(m2) || m1.isAfter(m2));
                case 'not gte':
                    return (!(m1.isSame(m2) || m1.isAfter(m2)));
                case 'lte':
                    return (m1.isSame(m2) || m1.isBefore(m2));
                case 'not lte':
                    return (!(m1.isSame(m2) || m1.isBefore(m2)));
                case 'empty':
                    return !!!a1.value;
                case 'not empty':
                    return !!a1.value;
                default:
                    e(context,`operator of type ${op} is not defined`);
                    return false;
            }
            break;
        }
        case 'currency': {
            const a1 = i1 as CurrencyValue;
            const a2 = i2 as CurrencyValue;
            if (a2 && a1.country !== a2.country) {
                return false;
            }
            switch (op) {
                case 'eq':
                    return (a1.value == a2.value);
                case 'not eq':
                    return (a1.value !== a2.value);
                case 'lt':
                    return (a1.value < a2.value);
                case 'not lt':
                    return !(a1.value < a2.value);
                case 'gt':
                    return (a1.value > a2.value);
                case 'not gt':
                    return !(a1.value > a2.value);
                case 'gte':
                    return (a1.value >= a2.value);
                case 'not gte':
                    return !(a1.value >= a2.value);
                case 'lte':
                    return (a1.value <= a2.value);
                case 'not lte':
                    return !(a1.value <= a2.value);
                case 'empty':
                    return !!!a1.value;
                case 'not empty':
                    return !!a1.value;
                default:
                    e(context,`operator of type ${op} is not defined`);
                    return false;
            }
            break;
        }
        case 'volume': {
            const a1 = i1 as VolumeValue;
            const a2 = i2 as VolumeValue;

            if (a2 && a1.unit !== a2.unit) {
                return false;
            }
            switch (op) {
                case 'eq':
                    return (a1.value == a2.value);
                case 'not eq':
                    return (a1.value !== a2.value);
                case 'lt':
                    return (a1.value < a2.value);
                case 'not lt':
                    return !(a1.value < a2.value);
                case 'gt':
                    return (a1.value > a2.value);
                case 'not gt':
                    return !(a1.value > a2.value);
                case 'gte':
                    return (a1.value >= a2.value);
                case 'not gte':
                    return !(a1.value >= a2.value);
                case 'lte':
                    return (a1.value <= a2.value);
                case 'not lte':
                    return !(a1.value <= a2.value);
                case 'empty':
                    return !!!a1.value;
                case 'not empty':
                    return !!a1.value;
                default:
                    e(context,`operator of type ${op} is not defined`);
                    return false;
            }
            break;
        }
        case 'dimension': {
            const a1 = i1 as DimensionValue;
            const a2 = i2 as DimensionValue;

            if (a2 && a1.unit !== a2.unit) {
                return false;
            }
            switch (op) {
                case 'eq':
                    return (a1.length == a2.length && a1.width == a2.width && a1.height == a2.height);
                case 'not eq':
                    return (a1.length !== a2.length && a1.width !== a2.width && a1.height !== a2.height);
                case 'lt':
                    return (a1.length < a2.length && a1.width < a2.width && a1.height < a2.height);
                case 'not lt':
                    return !(a1.length < a2.length && a1.width < a2.width && a1.height < a2.height);
                case 'gt':
                    return (a1.length > a2.length && a1.width > a2.width && a1.height > a2.height);
                case 'not gt':
                    return !(a1.length > a2.length && a1.width > a2.width && a1.height > a2.height);
                case 'gte':
                    return (a1.length >= a2.length && a1.width >= a2.width && a1.height >= a2.height);
                case 'not gte':
                    return !(a1.length >= a2.length && a1.width >= a2.width && a1.height >= a2.height);
                case 'lte':
                    return (a1.length <= a2.length && a1.width <= a2.width && a1.height <= a2.height);
                case 'not lte':
                    return !(a1.length <= a2.length && a1.width <= a2.width && a1.height <= a2.height);
                case 'empty':
                    return (!!!a1.length) && (!!!a1.width) && (!!!a1.height);
                case 'not empty':
                    return (!!a1.length) && (!!a1.width) && (!!a1.height);
                default:
                    e(context,`operator of type ${op} is not defined`);
                    return false;
            }
        }
        case 'area': {
            const a1 = i1 as AreaValue;
            const a2 = i2 as AreaValue;

            if (a2 && a1.unit !== a2.unit) {
                return false;
            }
            switch (op) {
                case 'eq':
                    return (a1.value == a2.value);
                case 'not eq':
                    return (a1.value !== a2.value);
                case 'lt':
                    return (a1.value < a2.value);
                case 'not lt':
                    return !(a1.value < a2.value);
                case 'gt':
                    return (a1.value > a2.value);
                case 'not gt':
                    return !(a1.value > a2.value);
                case 'gte':
                    return (a1.value >= a2.value);
                case 'not gte':
                    return !(a1.value >= a2.value);
                case 'lte':
                    return (a1.value <= a2.value);
                case 'not lte':
                    return !(a1.value <= a2.value);
                case 'empty':
                    return !!!a1.value;
                case 'not empty':
                    return !!a1.value;
                default:
                    e(context,`operator of type ${op} is not defined`);
                    return false;
            }
        }
        case 'width': {
            const a1 = i1 as WidthValue;
            const a2 = i2 as WidthValue;


            if (a2 && a1.unit !== a2.unit) {
                return false;
            }
            switch (op) {
                case 'eq':
                    return (a1.value == a2.value);
                case 'not eq':
                    return (a1.value !== a2.value);
                case 'lt':
                    return (a1.value < a2.value);
                case 'not lt':
                    return !(a1.value < a2.value);
                case 'gt':
                    return (a1.value > a2.value);
                case 'not gt':
                    return !(a1.value > a2.value);
                case 'gte':
                    return (a1.value >= a2.value);
                case 'not gte':
                    return !(a1.value >= a2.value);
                case 'lte':
                    return (a1.value <= a2.value);
                case 'not lte':
                    return !(a1.value <= a2.value);
                case 'empty':
                    return !!!a1.value;
                case 'not empty':
                    return !!a1.value;
                default:
                    e(context,`operator of type ${op} is not defined`);
                    return false;
            }
        }
        case 'height': {
            const a1 = i1 as HeightValue;
            const a2 = i2 as HeightValue;


            if (a2 && a1.unit !== a2.unit) {
                return false;
            }
            switch (op) {
                case 'eq':
                    return (a1.value == a2.value);
                case 'not eq':
                    return (a1.value !== a2.value);
                case 'lt':
                    return (a1.value < a2.value);
                case 'not lt':
                    return !(a1.value < a2.value);
                case 'gt':
                    return (a1.value > a2.value);
                case 'not gt':
                    return !(a1.value > a2.value);
                case 'gte':
                    return (a1.value >= a2.value);
                case 'not gte':
                    return !(a1.value >= a2.value);
                case 'lte':
                    return (a1.value <= a2.value);
                case 'not lte':
                    return !(a1.value <= a2.value);
                case 'empty':
                    return !!!a1.value;
                case 'not empty':
                    return !!a1.value;
                default:
                    e(context,`operator of type ${op} is not defined`);
                    return false;
            }
        }
        case 'select': {
            const a1 = i1 as SelectValue;
            const a2 = i2 as SelectValue;

            switch (op) {
                case 'eq':
                    return (a1.key == a2.key);
                case 'not eq':
                    return (a1.key !== a2.key);
                case 'lt':
                    return (a1.key < a2.key);
                case 'not lt':
                    return !(a1.key < a2.key);
                case 'gt':
                    return (a1.key > a2.key);
                case 'not gt':
                    return !(a1.key > a2.key);
                case 'gte':
                    return (a1.key >= a2.key);
                case 'not gte':
                    return !(a1.key >= a2.key);
                case 'lte':
                    return (a1.key <= a2.key);
                case 'not lte':
                    return !(a1.key <= a2.key);
                case 'empty':
                    return !!!a1.key;
                case 'not empty':
                    return !!a1.key;
                default:
                    e(context,`operator of type ${op} is not defined`);
                    return false;
            }
        }
        case 'doubleselect': {
            const a1 = i1 as DoubleSelectValue;
            const a2 = i2 as DoubleSelectValue;

            switch (op) {
                case 'eq':
                    return (a1.key1 == a2.key1 && a1.key2 == a2.key2);
                case 'not eq':
                    return (a1.key1 == a2.key1 && a1.key2 !== a2.key2);
                case 'lt':
                    return (a1.key1 == a2.key1 && a1.key2 < a2.key2);
                case 'not lt':
                    return (a1.key1 == a2.key1 && !(a1.key2 < a2.key2));
                case 'gt':
                    return (a1.key1 == a2.key1 && a1.key2 > a2.key2);
                case 'not gt':
                    return (a1.key1 == a2.key1 && !(a1.key2 > a2.key2));
                case 'gte':
                    return (a1.key1 == a2.key1 && !(a1.key2 >= a2.key2));
                case 'not gte':
                    return (a1.key1 == a2.key1 && !(a1.key2 >= a2.key2));
                case 'lte':
                    return (a1.key1 == a2.key1 && a1.key2 <= a2.key2);
                case 'not lte':
                    return (a1.key1 == a2.key1 && !(a1.key2 <= a2.key2));
                case 'empty':
                    return (!!!a1.key1 && !!!a1.key2);
                case 'not empty':
                    return (!!a1.key1 && !!a1.key2);
                default:
                    e(context,`operator of type ${op} is not defined`);
                    return false;
            }
        }
    }


    return false;
};


export const runValidation = async (viewId: number, validationId: number) => {
    try {

       await doInDbConnection(async (conn: Connection) => {
            await conn.query(`UPDATE TBL_VIEW_VALIDATION SET PROGRESS=? WHERE ID=?`, ['IN_PROGRESS', validationId]);
       });

        await _runValidation(viewId, validationId);

        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`UPDATE TBL_VIEW_VALIDATION SET PROGRESS=? WHERE ID=?`, ['COMPLETED', validationId]);
        });

    } catch (e) {
        e(`${e.toString()}`, e);

        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`UPDATE TBL_VIEW_VALIDATION SET PROGRESS=? WHERE ID=?`, ['FAILED', validationId]);
        });
    }
};

const _runValidation = async (viewId: number, validationId: number) => {
    let currentContext = {
        validationId,
    } as Context;

    await i(currentContext, `Running validation for viewId ${viewId} validationId ${validationId}`);

    const v: Validation = await getValidationByViewIdAndValidationId(viewId, validationId);
    await i(currentContext, `Successfully retrieved validation for validationId ${validationId}`);

    const a2s: Attribute2[] = await getAttributesInView(viewId);
    const as: Attribute[] = await attributeConverter.convert(a2s);
    await i(currentContext,`Succesfully retrieved attributes for viewId ${viewId}`);

    const item2s: Item2[] = await getAllItemsInView(viewId);
    const items: Item[] = itemConverter.convert(item2s);
    await i(currentContext, `Successfully retrieved all items for viewId ${viewId}`);

    const rule2s: Rule2[] = await getRule2s(viewId);
    const rules: Rule[] = ruleConverter.convert(rule2s);
    await i(currentContext, `Successfully retrieved all rules for viewId ${viewId}`);

    for (const item of items) {
        currentContext.item = item;
        for (const rule of rules) {
            currentContext.rule = rule;
            currentContext.errornousMessages = [];
            let wr  = true;
            await i(currentContext, `Validating itemId ${item.id} against ruleId ${rule.id} in viewId ${viewId}`);
            for (const whenClause of rule.whenClauses) {
                const att: Attribute = as.find((a: Attribute) => a.id === whenClause.attributeId);
                const value: Value = item[whenClause.attributeId];
                const i1: ItemValTypes = value.val;
                const i2: ItemValTypes = whenClause.condition;
                const op: OperatorType = whenClause.operator;
                currentContext.attribute = att;

                await i(currentContext,
                    `Validating WhenClause ${whenClause.id} 
                           (attributeId ${whenClause.attributeId} attributeName ${whenClause.attributeName} op ${whenClause.operator} 
                           against itemValueTypes ${itemValueTypesToString.toString(whenClause.condition)})
                           for itemId ${item.id} against ruleId ${rule.id} in viewId ${viewId}`);

                const tmp = match(currentContext, att, i1, i2, op);
                wr = wr && tmp;

                await i(currentContext,
                    `Validated current WhenClause result is [${tmp}] overall WhenClause result is [${wr}] for WhenClause ${whenClause.id} 
                           (attributeId ${whenClause.attributeId} attributeName ${whenClause.attributeName} op ${whenClause.operator} 
                           against itemValueTypes ${itemValueTypesToString.toString(whenClause.condition)})
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
                    const i1: ItemValTypes = value.val;
                    const i2: ItemValTypes = validateClause.condition;
                    const op: OperatorType = validateClause.operator;
                    currentContext.attribute = att;


                    await i(currentContext,
                        `Validating ValidateClause ${validateClause.id} 
                           (attributeId ${validateClause.attributeId} attributeName ${validateClause.attributeName} op ${validateClause.operator} 
                           against itemValueTypes ${itemValueTypesToString.toString(validateClause.condition)})
                           for itemId ${item.id} against ruleId ${rule.id} in viewId ${viewId}`);

                    const tmp = match(currentContext, att, i1, i2, op);
                    if (!tmp) { // this validation failed
                       currentContext.errornousMessages.push({
                           attribute: att,
                           item,
                           message: `Attribute ${att.name} (${att.id}) value ${itemValueTypesToString.toString(i1)} ${op} ${itemValueTypesToString.toString(i2)} FAILED `
                       });
                    }

                    vr = vr && tmp;

                    await i(currentContext,
                        `Validated current ValidateClause result is [${tmp}] overall ValidateClause result is [${wr}] for ValidateClause ${validateClause.id} 
                           (attributeId ${validateClause.attributeId} attributeName ${validateClause.attributeName} op ${validateClause.operator} 
                           against itemValueTypes ${itemValueTypesToString.toString(validateClause.condition)})
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
                                INSERT INTO TBL_VIEW_VALIDATION_ERROR (VIEW_VALIDATION_ID, ITEM_ID, ATTRIBUTE_ID, MESSAGE) VALUES (?,?,?,?)
                            `, [validationId, msg.item.id, msg.attribute.id]);
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


/*

                switch (i1.type) {
                    case 'text':
                        break;
                    case 'string':
                        break;
                    case 'number':
                        break;
                    case 'date':
                        break;
                    case 'currency':
                        break;
                    case 'volume':
                        break;
                    case 'dimension':
                        break;
                    case 'area':
                        break;
                    case 'width':
                        break;
                    case 'length':
                        break;
                    case 'height':
                        break;
                    case 'select':
                        break;
                    case 'doubleselect':
                        break;
                }

                switch (op) {
                    case 'eq':
                        break;
                    case 'not eq':
                        break;
                    case 'lt':
                        break;
                    case 'not lt':
                        break;
                    case 'gt':
                        break;
                    case 'not gt':
                        break;
                    case 'gte':
                        break;
                    case 'not gte':
                        break;
                    case 'lte':
                        break;
                    case 'not lte':
                        break;
                    case 'empty':
                        break;
                    case 'not empty':
                        break;
                }
 */
