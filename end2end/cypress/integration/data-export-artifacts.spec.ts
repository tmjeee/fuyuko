import {ImportPage} from "./page-object/sub-page-object/import.page";
import {LoginPage} from "./page-object/login.page";
import {ExportArtifactsPage} from "./page-object/sub-page-object/export-artifacts.page";

describe(`data export artifacts spec`, () => {

    let exportArtifactsPage: ExportArtifactsPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        exportArtifactsPage = new LoginPage()
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
        exportArtifactsPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        exportArtifactsPage
            .visit()
            .validateTitle()
        ;
    });

    //////////////////
});
