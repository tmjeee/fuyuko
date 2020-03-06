import {LoginPage} from "./page-object/login.page";
import {BulkEditPage} from "./page-object/bulk-edit.page";

describe(`bulk edit spec`, () => {

    let bulkEditPage: BulkEditPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        bulkEditPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitBulkEditPage();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        bulkEditPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        bulkEditPage
            .visit()
            .validateTitle()
        ;
    });

    //////////////////

    it (`should be able switch views`, () => {
        const testView1 = `Test View 1`;
        const testView2 = `Test View 2`;
        const testView3 = `Test View 3`;
        bulkEditPage
            .selectView(testView2)
            .verifySelectedView(testView2)
            .selectView(testView3)
            .verifySelectedView(testView3)
            .selectView(testView1)
            .verifySelectedView(testView1)
    });

    it(`should perform add and delete change and where clauses`, () => {
        const i = 0;
        const viewName = `Test View 1`;
        const whenAttributeName: string = `string attribute`;
        const whenOp = `not contain`;
        const whenValue = `xxxxxx`;
        const changeAttributeName: string = `string attribute`;
        const changeAttributeValue = `zzzzzzzzzzzzzzzz`;

        bulkEditPage
            .startWizard()
            .verifyStep()
            .editWhenString(i, whenAttributeName, whenOp, whenValue)
            .editChangeString(i, changeAttributeName, changeAttributeValue)
    });


});
