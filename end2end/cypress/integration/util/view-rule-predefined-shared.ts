import {ViewRulePage} from "../page-object/sub-page-object/view-rule.page";
import {OperatorType} from "../model/operator.model";

export const w = (viewRulePage: ViewRulePage, opts: {
    fillInWhenClauseFnName: string,
    verifyWhenClauseFnName: string,
    fillInValidateClauseFnName: string,
    verifyValidateClauseFnName: string,
    attributeName: string,
    whenClause_opForAdd: OperatorType,
    whenClause_valForAdd: any[],
    validateClause_opForAdd: OperatorType,
    validateClause_valForAdd: any[],
    whenClause_opForEdit: OperatorType,
    whenClause_valForEdit: any[],
    validateClause_opForEdit: OperatorType,
    validateClause_valForEdit: any[]
}) => {

    const r = Math.random();
    const ruleName = `name-${r}`;
    const ruleDescription = `description-${r}`;

    // add rule
    viewRulePage
        .selectPredefinedTab()
        .clickAddRule()
        .validateTitle()
        .fillInRuleName(ruleName)
        .fillInRuleDescription(ruleDescription)
        .clickAddValidateClause()
        .verifyValidateClauseSize(2)
        .clickAddWhenClause()
        .verifyWhenClauseSize(2)
        .verifySubmittable(false)
        [opts.fillInWhenClauseFnName](0, opts.attributeName, opts.whenClause_opForAdd, opts.whenClause_valForAdd) // (1)
        [opts.verifyWhenClauseFnName](0, opts.attributeName, opts.whenClause_opForAdd, opts.whenClause_valForAdd) // (2)
        .fillInWhenClauseNumberAttribute(1, 'number attribute', 'eq', [1.1, 2.1])
        .verifyWhenClauseNumberAttribute(1, 'number attribute', 'eq', [1.1, 2.1])
        [opts.fillInValidateClauseFnName](0, opts.attributeName, opts.validateClause_opForAdd, opts.validateClause_valForAdd) // (3)
        [opts.verifyValidateClauseFnName](0, opts.attributeName, opts.validateClause_opForAdd, opts.validateClause_valForAdd) // (4)
        .fillInValidateClauseNumberAttribute(1, 'number attribute', 'eq', [3.1, 4.1])
        .verifyValidateClauseNumberAttribute(1, 'number attribute', 'eq', [3.1, 4.1])
        .verifySubmittable(true)
        .submit()
        .verifySuccessMessageExists()
    ;

    // verify rule added
    viewRulePage
        .visit()
        .selectPredefinedTab()
        .togglePanel(ruleName)
        .verifyPanelExpanded(ruleName, true)
        .verifyPanelWhenClauseContains(ruleName, opts.attributeName, opts.whenClause_opForAdd, opts.whenClause_valForAdd)  // (5)
        .verifyPanelWhenClauseContains(ruleName, 'number attribute', 'eq', ['1.1', '2.1'])
        .verifyPanelValidateClauseContains(ruleName, opts.attributeName, opts.validateClause_opForAdd, opts.validateClause_valForAdd) // (6)
        .verifyPanelValidateClauseContains(ruleName, 'number attribute', 'eq', ['3.1', '4.1'])
    ;

    // edit added rule
    viewRulePage
        .visit()
        .selectPredefinedTab()
        .clickEditRule(ruleName)
        .fillInWhenClauseNumberAttribute(0, 'number attribute', 'not eq', [10.1, 20.1])
        .verifyWhenClauseNumberAttribute(0, 'number attribute', 'not eq', [10.1, 20.1])
        [opts.fillInWhenClauseFnName](1, opts.attributeName, opts.whenClause_opForEdit, opts.whenClause_valForEdit) // (7)
        [opts.verifyWhenClauseFnName](1, opts.attributeName, opts.whenClause_opForEdit, opts.whenClause_valForEdit) // (8)
        .fillInValidateClauseNumberAttribute(0, 'number attribute', 'not eq', [30.1, 40.1])
        .verifyValidateClauseNumberAttribute(0, 'number attribute', 'not eq', [30.1, 40.1])
        [opts.fillInValidateClauseFnName](1, opts.attributeName, opts.validateClause_opForEdit, opts.validateClause_valForEdit) // (9)
        [opts.verifyValidateClauseFnName](1, opts.attributeName, opts.validateClause_opForEdit, opts.validateClause_valForEdit) // (10)
        .verifySubmittable(true)
        .submit()
        .verifySuccessMessageExists()
    ;

    // verify edited changes
    viewRulePage
        .visit()
        .selectPredefinedTab()
        .togglePanel(ruleName)
        .verifyPanelExpanded(ruleName, true)
        .verifyPanelWhenClauseContains(ruleName, 'number attribute', 'not eq', ['10.1', '20.1'])
        .verifyPanelWhenClauseContains(ruleName, opts.attributeName, opts.whenClause_opForEdit, opts.whenClause_valForEdit)  // (11)
        .verifyPanelValidateClauseContains(ruleName, 'number attribute', 'not eq', ['30.1', '40.1'])
        .verifyPanelValidateClauseContains(ruleName, opts.attributeName, opts.validateClause_opForEdit, opts.validateClause_valForEdit) // (12)
    ;

    // delete rule
    viewRulePage
        .visit()
        .selectPredefinedTab()
        .clickDeleteRule(ruleName)
        .verifySuccessMessageExists()
    ;
};

