import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from '../helpers/test-helper';
import {
    addOrUpdateRules,
    getAttributeInViewByName,
    getRule,
    getRules,
    getViewByName,
    updateRuleStatus
} from '../../src/service';
import {View} from '@fuyuko-common/model/view.model';
import {Rule, ValidateClause, WhenClause} from '@fuyuko-common/model/rule.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {NumberValue, StringValue} from '@fuyuko-common/model/item.model';


describe('rule.service', () => {

    let view: View;
    let stringAttribute: Attribute;
    let numberAttribute: Attribute;

    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2();
        view = await getViewByName('Test View 1');
        stringAttribute = await getAttributeInViewByName(view.id, 'string attribute') as Attribute;
        numberAttribute = await getAttributeInViewByName(view.id, 'number attribute') as Attribute;
    }, JASMINE_TIMEOUT);

    it('test addOrUpdateRules & updateRuleStatus', async () => {
        const name = `XXXRule-${Math.random()}`;
        const err1: string[] = await addOrUpdateRules(view.id, [
            {
                level: 'WARN',
                name,
                description: 'XXXRule Description',
                status: 'ENABLED',
                validateClauses: [
                    {
                       attributeId: stringAttribute.id,
                       attributeName: stringAttribute.name,
                       attributeType: stringAttribute.type,
                       operator: "eq",
                       condition: [
                           {
                               type: 'string',
                               value: 'xxxxxx'
                           } as StringValue
                       ]
                    } as ValidateClause
                ],
                whenClauses: [
                    {
                        id: 1,
                        attributeId: numberAttribute.id,
                        attributeName: numberAttribute.name,
                        attributeType: numberAttribute.type,
                        operator: 'eq',
                        condition: [
                            {
                                type: "number",
                                value: 10
                            } as NumberValue
                        ]
                    } as WhenClause
                ]
            } as Rule
        ]);

        expect(err1.length).toBe(0);

        const rules: Rule[] = await getRules(view.id);
        const rule = rules.find((_: Rule) => _.name === name);
        expect(rule).toBeTruthy();
        expect(rule!.name).toBe(name);
        expect(rule!.description).toBe('XXXRule Description');
        expect(rule!.whenClauses.length).toBe(1);
        expect(rule!.whenClauses[0].attributeId).toBe(numberAttribute.id);
        expect(rule!.whenClauses[0].attributeName).toBe(numberAttribute.name);
        expect(rule!.whenClauses[0].attributeType).toBe(numberAttribute.type);
        expect(rule!.whenClauses[0].operator).toBe('eq');
        expect(rule!.whenClauses[0].condition.length).toBe(1);
        expect(rule!.whenClauses[0].condition[0].type).toBe('number');
        expect((rule!.whenClauses[0].condition[0] as NumberValue).value).toBe(10);
        expect(rule!.validateClauses.length).toBe(1);
        expect(rule!.validateClauses[0].attributeId).toBe(stringAttribute.id);
        expect(rule!.validateClauses[0].attributeName).toBe(stringAttribute.name);
        expect(rule!.validateClauses[0].attributeType).toBe(stringAttribute.type);
        expect(rule!.validateClauses[0].operator).toBe('eq');
        expect(rule!.validateClauses[0].condition.length).toBe(1);
        expect(rule!.validateClauses[0].condition[0].type).toBe('string');
        expect((rule!.validateClauses[0].condition[0] as StringValue).value).toBe('xxxxxx');


        const name2 = `YYYRule-${Math.random()}`;
        const err2: string[] = await addOrUpdateRules(view.id, [{
            id: rule!.id,
            name: name2,
            description: 'YYYRule Description',
            status: 'ENABLED',
            level: 'ERROR',
            validateClauses: [
                {
                    id: 2,
                    attributeId: numberAttribute.id,
                    attributeName: numberAttribute.name,
                    attributeType: numberAttribute.type,
                    operator: 'eq',
                    condition: [
                        {
                            type: "number",
                            value: 10
                        } as NumberValue
                    ]
                } as ValidateClause
            ],
            whenClauses: [
                {
                    attributeId: stringAttribute.id,
                    attributeName: stringAttribute.name,
                    attributeType: stringAttribute.type,
                    operator: "eq",
                    condition: [
                        {
                            type: 'string',
                            value: 'xxxxxx'
                        } as StringValue
                    ]
                } as WhenClause
            ]
        } as Rule]);
        expect(err2.length).toBe(0);
        const rules2: Rule[] = await getRules(view.id);
        const rule2 = rules2.find((_: Rule) => _.name === name2);
        expect(rule2).toBeTruthy();
        expect(rule2!.name).toBe(name2);
        expect(rule2!.level).toBe('ERROR');
        expect(rule2!.description).toBe('YYYRule Description');
        expect(rule2!.whenClauses.length).toBe(1);
        expect(rule2!.validateClauses[0].attributeId).toBe(numberAttribute.id);
        expect(rule2!.validateClauses[0].attributeName).toBe(numberAttribute.name);
        expect(rule2!.validateClauses[0].attributeType).toBe(numberAttribute.type);
        expect(rule2!.validateClauses[0].operator).toBe('eq');
        expect(rule2!.validateClauses[0].condition.length).toBe(1);
        expect(rule2!.validateClauses[0].condition[0].type).toBe('number');
        expect((rule2!.validateClauses[0].condition[0] as NumberValue).value).toBe(10);
        expect(rule2!.whenClauses.length).toBe(1);
        expect(rule2!.whenClauses[0].attributeId).toBe(stringAttribute.id);
        expect(rule2!.whenClauses[0].attributeName).toBe(stringAttribute.name);
        expect(rule2!.whenClauses[0].attributeType).toBe(stringAttribute.type);
        expect(rule2!.whenClauses[0].operator).toBe('eq');
        expect(rule2!.whenClauses[0].condition.length).toBe(1);
        expect(rule2!.whenClauses[0].condition[0].type).toBe('string');
        expect((rule2!.whenClauses[0].condition[0] as StringValue).value).toBe('xxxxxx');

        const r1: boolean = await updateRuleStatus(rule2!.id, 'DISABLED');
        expect(r1).toBeTrue();
        const rules3: Rule[] = await getRules(view.id);
        const rule3 = rules3.find((_: Rule) => _.name === name2);
        expect(rule3!.status).toBe('DISABLED');

        const r2: boolean = await updateRuleStatus(rule2!.id, 'ENABLED');
        expect(r2).toBeTrue();
        const rules4: Rule[] = await getRules(view.id);
        const rule4 = rules4.find((_: Rule) => _.name === name2);
        expect(rule4!.status).toBe('ENABLED');
    });

    it ('test getRule and getRules', async () => {
        const rules: Rule[] = await getRules(view.id);

        // console.log(util.inspect(rules));
        expect(rules.length).toBeGreaterThanOrEqual(7);
        expect(rules[0].name).toBe('Rule #1');
        expect(rules[1].name).toBe('Rule #2');
        expect(rules[2].name).toBe('Rule #3');
        expect(rules[3].name).toBe('Rule #4');
        expect(rules[4].name).toBe('Rule #5');
        expect(rules[5].name).toBe('Rule #6');
        expect(rules[6].name).toBe('Rule #7');

        const rule: Rule = await getRule(view.id, rules[0].id);
        expect(rule).toBeTruthy();
        expect(rule.name).toBe('Rule #1');
    });
});
