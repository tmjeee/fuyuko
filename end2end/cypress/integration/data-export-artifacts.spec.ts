import {ImportPage} from "./page-object/sub-page-object/import.page";
import {LoginPage} from "./page-object/login.page";
import {ExportArtifactsPage} from "./page-object/sub-page-object/export-artifacts.page";
import {
    ExportPage,
    ExportPageStep1,
    ExportPageStep2,
    ExportPageStep3,
    ExportPageStep4, ExportPageStep5
} from "./page-object/sub-page-object/export.page";

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


    it.only (`should be able to delete artifact`, () => {

        const viewName = `Test View 1`;

        const exportPage: ExportPage = new ExportPage()
            .visit();

        const step1: ExportPageStep1 = exportPage
            .clickStep1();

        // select view
        const step2: ExportPageStep2 = step1
            .verifyInStep()
            .selectExportView(viewName)
            .clickNext();

        // select export type and attributes
        const step3: ExportPageStep3 = step2
            .verifyInStep()
            .selectExportType('ITEM')
            .selectExportAllAttributes()
            .clickNext() as ExportPageStep3;

        // item filtering
        const step4: ExportPageStep4 = step3
            .verifyInStep()
            .clickNext();

        cy.wait(1000);

        // preview
        const step5: ExportPageStep5 = step4
            .verifyInStep()
            .clickNext();

        // done
        step5
            .verifyInStep()
            .clickDone();

        cy.wait(1000);

        exportArtifactsPage
            .visit()
            .validateTitle()
            .verifyName(0, 'item-data-export')
            .verifyViewMimeType(0, 'text/csv')
            .verifyViewName(0, viewName)
            .clickDelete(0)
            .verifySuccessMessageExists()
        ;
    })
});
