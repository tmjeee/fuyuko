import {ViewRulePage} from "./page-object/sub-page-object/view-rule.page";
import {LoginPage} from "./page-object/login.page";

describe('view-rule-predefined-width', () => {

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
            .visitViewRule();
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });
    it(`(width, eq, not eq) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(width, empty, not empty) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(width, lt, not lt) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(width, gt, not gt) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(width, lte, not lte) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(width, gte, not gte) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
});
