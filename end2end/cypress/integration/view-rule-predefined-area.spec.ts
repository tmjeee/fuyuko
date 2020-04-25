import {ViewRulePage} from "./page-object/sub-page-object/view-rule.page";
import {LoginPage} from "./page-object/login.page";

describe('view-rule-predefined-area', () => {

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
        localStorage.clear();
        sessionStorage.clear();
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
    it(`(area, eq, not eq) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(area, empty, not empty) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(area, lt, not lt) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(area, gt, not gt) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(area, lte, not lte) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
    it(`(area, gte, not gte) should allow add / edit / delete with multiple 'when' / 'validate' clauses and multiple conditions on each clauses`, () => {
    });
});
