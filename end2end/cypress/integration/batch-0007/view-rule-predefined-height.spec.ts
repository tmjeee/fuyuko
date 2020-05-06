import {ViewRulePage} from "../page-object/sub-page-object/view-rule.page";
import {LoginPage} from "../page-object/login.page";

describe('view-rule-predefined-height', () => {

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
    it(`(height, eq, not eq) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(height, empty, not empty) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(height, lt, not lt) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(height, gt, not gt) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(height, lte, not lte) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(height, gte, not gte) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
});
