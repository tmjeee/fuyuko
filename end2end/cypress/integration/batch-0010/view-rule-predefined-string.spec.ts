import {ViewRulePage} from "../page-object/sub-page-object/view-rule.page";
import {LoginPage} from "../page-object/login.page";
import {w} from "../util/view-rule-predefined-shared";

describe('view-rule-predefined-string', () => {

    let viewRulePage: ViewRulePage;

    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // viewRulePage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitViewPage()
        //     .visitViewRule();
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewRulePage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitViewRule()
            .selectGlobalView(`Test View 1`);
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });

    it (`(string, eq, not eq) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
        w(viewRulePage, {
            fillInWhenClauseFnName: `fillInWhenClauseStringAttribute`,
            verifyWhenClauseFnName: `verifyWhenClauseStringAttribute`,
            fillInValidateClauseFnName: `fillInValidateClauseStringAttribute`,
            verifyValidateClauseFnName: `verifyValidateClauseStringAttribute`,
            attributeName: `string attribute`,
            whenClause_opForAdd: `eq`,
            whenClause_valForAdd: [`text1`, `text2`],
            validateClause_opForAdd: `eq`,
            validateClause_valForAdd: [`text3`, `text4`],
            whenClause_opForEdit: `not eq`,
            whenClause_valForEdit: [`text10`, `text20`],
            validateClause_opForEdit: `not eq`,
            validateClause_valForEdit: [`text30`, `text40`]
        });
    });

    it(`(string, empty, not empty) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
        w(viewRulePage, {
            fillInWhenClauseFnName: `fillInWhenClauseStringAttribute`,
            verifyWhenClauseFnName: `verifyWhenClauseStringAttribute`,
            fillInValidateClauseFnName: `fillInValidateClauseStringAttribute`,
            verifyValidateClauseFnName: `verifyValidateClauseStringAttribute`,
            attributeName: `string attribute`,
            whenClause_opForAdd: `empty`,
            whenClause_valForAdd: [],
            validateClause_opForAdd: `empty`,
            validateClause_valForAdd: [],
            whenClause_opForEdit: `not empty`,
            whenClause_valForEdit: [],
            validateClause_opForEdit: `not empty`,
            validateClause_valForEdit: []
        });
    });
});
