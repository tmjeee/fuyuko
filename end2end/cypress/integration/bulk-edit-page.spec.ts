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


    it (`should perform bulk edit`, () => {



    });


});
