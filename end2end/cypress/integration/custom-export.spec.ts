import {CustomImportPage} from "./page-object/sub-page-object/custom-import.page";
import {LoginPage} from "./page-object/login.page";
import {CustomExportPage} from "./page-object/sub-page-object/custom-export.page";


describe(`custom export spec`, () => {

    let customExportPage: CustomExportPage;


    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');

        // create new view
        customExportPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitImportExportPage()
            .visitCustomExportPage()
        ;
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        customExportPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        customExportPage
            .visit()
            .validateTitle()
        ;
    });

    //////////////////

    it (`should go do export`, () => {

    });
});