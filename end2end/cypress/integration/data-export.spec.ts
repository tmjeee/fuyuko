import {LoginPage} from "./page-object/login.page";
import {ExportArtifactsPage} from "./page-object/sub-page-object/export-artifacts.page";

describe(`data export spec`, () => {

    let exportPage: ExportArtifactsPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        exportPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitImportExportPage()
            .visitExportArtifactsPage();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        exportPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        exportPage
            .visit()
            .validateTitle()
        ;
    });

    //////////////////

    it(`should export attributes`, () => {
        exportPage
            .visit()

    });
});
