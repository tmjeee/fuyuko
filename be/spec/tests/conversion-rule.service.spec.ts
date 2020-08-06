import {ruleConvert, ruleRevert} from "../../src/service";
import {Rule2} from "../../src/server-side-model/server-side.model";
import {Rule, ValidateClause, WhenClause} from "../../src/model/rule.model";
import {ENABLED} from "../../src/model/status.model";
import {ItemValTypes, NumberValue, StringValue} from "../../src/model/item.model";
import {AttributeType} from "../../src/model/attribute.model";
import {OperatorType} from "../../src/model/operator.model";
import * as util from "util";
import {setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";


describe('conversion-rule.service', () => {

    it(`ruleConvert`, () => {
        const rule = ruleConvert({
            id: 1,
            name: 'test',
            description: 'test description',
            status: 'ENABLED',
            whenClauses: [
                {
                    id: 2,
                    attributeId: 3,
                    attributeName: 'att1',
                    attributeType: 'string',
                    operator: 'eq',
                    metadatas: [
                        {
                            id: -1,
                            name: '',
                            entries: [
                                {
                                    id: -1,
                                    key: 'type',
                                    value: 'string',
                                    dataType: 'string'
                                },
                                { id: -1, key: 'value', value: 'xxx', dataType: 'string' }
                            ]
                        },
                        {
                            id: -1,
                            attributeType: 'number',
                            attributeId: 3,
                            name: '',
                            entries: [
                                {
                                    id: -1,
                                    key: 'type',
                                    value: 'number',
                                    dataType: 'string'
                                },
                                { id: -1, key: 'value', value: '111', dataType: 'number' }
                            ]
                        }
                    ]
                }
            ],
            validateClauses: [
                {
                    id: 4,
                    attributeId: 5,
                    attributeName: 'att2',
                    attributeType: 'string',
                    operator: 'eq',
                    metadatas: [
                        {
                            id: -1,
                            name: '',
                            entries: [
                                {
                                    id: -1,
                                    key: 'type',
                                    value: 'string',
                                    dataType: 'string'
                                },
                                { id: -1, key: 'value', value: 'yyy', dataType: 'string' }
                            ]
                        },
                        {
                            id: -1,
                            attributeType: 'number',
                            attributeId: 5,
                            name: '',
                            entries: [
                                {
                                    id: -1,
                                    key: 'type',
                                    value: 'number',
                                    dataType: 'string'
                                },
                                { id: -1, key: 'value', value: '222', dataType: 'number' }
                            ]
                        }
                    ]
                }
            ]
        } as Rule2);

        // console.log(util.inspect(rule, {depth: 10}));
        expect(rule.id).toBe(1);
        expect(rule.name).toBe('test');
        expect(rule.status).toBe(ENABLED);
        expect(rule.description).toBe('test description');
        expect(rule.validateClauses.length).toBe(1);
        expect(rule.validateClauses[0].id).toBe(4);
        expect(rule.validateClauses[0].attributeId).toBe(5);
        expect(rule.validateClauses[0].attributeName).toBe('att2');
        expect(rule.validateClauses[0].attributeType).toBe('string');
        expect(rule.validateClauses[0].operator).toBe('eq');
        expect(rule.validateClauses[0].condition.length).toBe(2);
        expect((rule.validateClauses[0].condition[0] as StringValue).type).toBe('string');
        expect((rule.validateClauses[0].condition[0] as StringValue).value).toBe('yyy');
        expect((rule.validateClauses[0].condition[1] as NumberValue).type).toBe('number');
        expect((rule.validateClauses[0].condition[1] as NumberValue).value).toBe(222);
        expect(rule.whenClauses.length).toBe(1);
        expect(rule.whenClauses[0].id).toBe(2);
        expect(rule.whenClauses[0].attributeId).toBe(3);
        expect(rule.whenClauses[0].attributeName).toBe('att1');
        expect(rule.whenClauses[0].attributeType).toBe('string');
        expect(rule.whenClauses[0].operator).toBe('eq');
        expect(rule.whenClauses[0].condition.length).toBe(2);
        expect((rule.whenClauses[0].condition[0] as StringValue).type).toBe('string');
        expect((rule.whenClauses[0].condition[0] as StringValue).value).toBe('xxx');
        expect((rule.whenClauses[0].condition[1] as NumberValue).type).toBe('number');
        expect((rule.whenClauses[0].condition[1] as NumberValue).value).toBe(111);

    });

    it(`ruleRevert`, () => {
        const rule2: Rule2 = ruleRevert({
           id: 1,
           name: 'test',
           description: 'test description',
           status: ENABLED,
           whenClauses: [
               {
                  id: 2,
                  attributeId: 3,
                  attributeName: 'att1',
                  attributeType: 'string',
                  operator: 'eq',
                  condition: [
                      {
                         type: 'string',
                         value: 'xxx'
                      } as StringValue,
                      {
                          type: 'number',
                          value: 111
                      } as NumberValue
                  ]
               } as WhenClause
           ],
           validateClauses: [
               {
                   id: 4,
                   attributeId: 5,
                   attributeName: 'att2',
                   attributeType: 'string',
                   operator: 'eq',
                   condition: [
                       {
                           type: 'string',
                           value: 'yyy'
                       } as StringValue,
                       {
                           type: 'number',
                           value: 222
                       } as NumberValue
                   ]
               } as ValidateClause
           ]
        } as Rule);

        // console.log(util.inspect(rule2, {depth: 10}));
        expect(rule2.id).toBe(1);
        expect(rule2.name).toBe('test');
        expect(rule2.description).toBe('test description');
        expect(rule2.status).toBe(ENABLED);
        expect(rule2.whenClauses.length).toBe(1);
        expect(rule2.whenClauses[0].id).toBe(2);
        expect(rule2.whenClauses[0].attributeId).toBe(3);
        expect(rule2.whenClauses[0].attributeName).toBe('att1');
        expect(rule2.whenClauses[0].attributeType).toBe('string');
        expect(rule2.whenClauses[0].operator).toBe('eq');
        expect(rule2.whenClauses[0].metadatas.length).toBe(2);
        expect(rule2.whenClauses[0].metadatas[0].entries.length).toBe(2);
        expect(rule2.whenClauses[0].metadatas[0].entries[0].key).toBe('type');
        expect(rule2.whenClauses[0].metadatas[0].entries[0].value).toBe('string');
        expect(rule2.whenClauses[0].metadatas[0].entries[0].dataType).toBe('string');
        expect(rule2.whenClauses[0].metadatas[0].entries[1].key).toBe('value');
        expect(rule2.whenClauses[0].metadatas[0].entries[1].value).toBe('xxx');
        expect(rule2.whenClauses[0].metadatas[0].entries[1].dataType).toBe('string');
        expect(rule2.whenClauses[0].metadatas[1].entries[0].key).toBe('type');
        expect(rule2.whenClauses[0].metadatas[1].entries[0].value).toBe('number');
        expect(rule2.whenClauses[0].metadatas[1].entries[0].dataType).toBe('string');
        expect(rule2.whenClauses[0].metadatas[1].entries[1].key).toBe('value');
        expect(rule2.whenClauses[0].metadatas[1].entries[1].value).toBe('111');
        expect(rule2.whenClauses[0].metadatas[1].entries[1].dataType).toBe('number');

        expect(rule2.validateClauses.length).toBe(1);
        expect(rule2.validateClauses[0].id).toBe(4);
        expect(rule2.validateClauses[0].attributeId).toBe(5);
        expect(rule2.validateClauses[0].attributeName).toBe('att2');
        expect(rule2.validateClauses[0].attributeType).toBe('string');
        expect(rule2.validateClauses[0].operator).toBe('eq');
        expect(rule2.validateClauses[0].metadatas.length).toBe(2);
        expect(rule2.validateClauses[0].metadatas[0].entries.length).toBe(2);
        expect(rule2.validateClauses[0].metadatas[0].entries[0].key).toBe('type');
        expect(rule2.validateClauses[0].metadatas[0].entries[0].value).toBe('string');
        expect(rule2.validateClauses[0].metadatas[0].entries[0].dataType).toBe('string');
        expect(rule2.validateClauses[0].metadatas[0].entries[1].key).toBe('value');
        expect(rule2.validateClauses[0].metadatas[0].entries[1].value).toBe('yyy');
        expect(rule2.validateClauses[0].metadatas[0].entries[1].dataType).toBe('string');
        expect(rule2.validateClauses[0].metadatas[1].entries[0].key).toBe('type');
        expect(rule2.validateClauses[0].metadatas[1].entries[0].value).toBe('number');
        expect(rule2.validateClauses[0].metadatas[1].entries[0].dataType).toBe('string');
        expect(rule2.validateClauses[0].metadatas[1].entries[1].key).toBe('value');
        expect(rule2.validateClauses[0].metadatas[1].entries[1].value).toBe('222');
        expect(rule2.validateClauses[0].metadatas[1].entries[1].dataType).toBe('number');
    });

});