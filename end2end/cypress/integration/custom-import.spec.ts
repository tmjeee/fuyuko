import {LoginPage} from "./page-object/login.page";
import {ImportExportPage} from "./page-object/import-export.page";
import {CustomImportPage} from "./page-object/sub-page-object/custom-import.page";


describe('custom import spec', () => {

    let customImportPage: CustomImportPage;


    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');

        // create new view
        customImportPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitImportExportPage()
            .visitCustomImportPage()
        ;
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        customImportPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        customImportPage
            .visit()
            .validateTitle()
        ;
    });

    //////////////////

    it (`should go do import`, () => {

    });
});