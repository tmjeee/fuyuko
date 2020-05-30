import {ViewRulePage} from "../page-object/sub-page-object/view-rule.page";
import {OperatorType} from "../model/operator.model";

export const w = (viewRulePage: ViewRulePage, opts: {
    viewName: string,
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
        .selectGlobalView(opts.viewName)
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
        .fillInWhenClauseNumberAttribute(1, 'number attribute', 'eq', [1.11, 2.11])
        .verifyWhenClauseNumberAttribute(1, 'number attribute', 'eq', [1.11, 2.11])
        [opts.fillInValidateClauseFnName](0, opts.attributeName, opts.validateClause_opForAdd, opts.validateClause_valForAdd) // (3)
        [opts.verifyValidateClauseFnName](0, opts.attributeName, opts.validateClause_opForAdd, opts.validateClause_valForAdd) // (4)
        .fillInValidateClauseNumberAttribute(1, 'number attribute', 'eq', [3.11, 4.11])
        .verifyValidateClauseNumberAttribute(1, 'number attribute', 'eq', [3.11, 4.11])
        .verifySubmittable(true)
        .submit()
        .verifySuccessMessageExists()
    ;

    // verify rule added
    viewRulePage
        .visit()
        .selectGlobalView(opts.viewName)
        .selectPredefinedTab()
        .togglePanel(ruleName)
        .verifyPanelExpanded(ruleName, true)
        .verifyPanelWhenClauseContains(ruleName, opts.attributeName, opts.whenClause_opForAdd, opts.whenClause_valForAdd)  // (5)
        .verifyPanelWhenClauseContains(ruleName, 'number attribute', 'eq', ['1.11', '2.11'])
        .verifyPanelValidateClauseContains(ruleName, opts.attributeName, opts.validateClause_opForAdd, opts.validateClause_valForAdd) // (6)
        .verifyPanelValidateClauseContains(ruleName, 'number attribute', 'eq', ['3.11', '4.11'])
    ;

    // edit added rule
    viewRulePage
        .visit()
        .selectGlobalView(opts.viewName)
        .selectPredefinedTab()
        .clickEditRule(ruleName)
        .fillInWhenClauseNumberAttribute(0, 'number attribute', 'not eq', [10.11, 20.11])
        .verifyWhenClauseNumberAttribute(0, 'number attribute', 'not eq', [10.11, 20.11])
        [opts.fillInWhenClauseFnName](1, opts.attributeName, opts.whenClause_opForEdit, opts.whenClause_valForEdit) // (7)
        [opts.verifyWhenClauseFnName](1, opts.attributeName, opts.whenClause_opForEdit, opts.whenClause_valForEdit) // (8)
        .fillInValidateClauseNumberAttribute(0, 'number attribute', 'not eq', [30.11, 40.11])
        .verifyValidateClauseNumberAttribute(0, 'number attribute', 'not eq', [30.11, 40.11])
        [opts.fillInValidateClauseFnName](1, opts.attributeName, opts.validateClause_opForEdit, opts.validateClause_valForEdit) // (9)
        [opts.verifyValidateClauseFnName](1, opts.attributeName, opts.validateClause_opForEdit, opts.validateClause_valForEdit) // (10)
        .verifySubmittable(true)
        .submit()
        .verifySuccessMessageExists()
    ;

    // verify edited changes
    viewRulePage
        .visit()
        .selectGlobalView(opts.viewName)
        .selectPredefinedTab()
        .togglePanel(ruleName)
        .verifyPanelExpanded(ruleName, true)
        .verifyPanelWhenClauseContains(ruleName, 'number attribute', 'not eq', ['10.11', '20.11'])
        .verifyPanelWhenClauseContains(ruleName, opts.attributeName, opts.whenClause_opForEdit, opts.whenClause_valForEdit)  // (11)
        .verifyPanelValidateClauseContains(ruleName, 'number attribute', 'not eq', ['30.11', '40.11'])
        .verifyPanelValidateClauseContains(ruleName, opts.attributeName, opts.validateClause_opForEdit, opts.validateClause_valForEdit) // (12)
    ;

    // delete rule
    viewRulePage
        // .visit()
        // .selectGlobalView(opts.viewName)
        .selectPredefinedTab()
        .clickDeleteRule(ruleName)
        .verifySuccessMessageExists()
    ;
};

