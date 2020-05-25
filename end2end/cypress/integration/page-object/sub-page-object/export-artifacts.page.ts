import * as util from "../../util/util";


export class ExportArtifactsPage {

    visit(): ExportArtifactsPage {
        cy.visit('/import-export-gen-layout/(export-artifacts//help:import-help)');
        cy.waitUntil(() => cy.get(`[test-export-artifacts-component]`));
        return this;
    }

    validateTitle(): ExportArtifactsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'export-artifacts');
        return this;
    }

    verifyErrorMessageExists(): ExportArtifactsPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): ExportArtifactsPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    ////////////////////

    verifyViewName(index: number, viewName: string): ExportArtifactsPage {
        cy.waitUntil(() => cy.get(`[test-table-row-index='${index}']
            [test-table-column-view='${viewName}']`))
            .should('exist');
        return this;
    }

    verifyViewMimeType(index: number, mimeType: string): ExportArtifactsPage {
        cy.waitUntil(() => cy.get(`[test-table-row-index='${index}']
            [test-table-column-mimetype='${mimeType}']`))
            .should('exist');
        return this;
    }

    clickDownload(index: number): ExportArtifactsPage {
        cy.waitUntil(() => cy.get(`[test-table-row-index='${index}']
            [test-link-download]`)).click({force: true});
        return this;
    }

    verifyName(index: number, value: string): ExportArtifactsPage {
        cy.waitUntil(() => cy.get(`[test-table-row-index='${index}']
            [test-table-column-name]`))
            .should('contain.text', value)
        return this;
    }

    clickDelete(index: number): ExportArtifactsPage {
        cy.waitUntil(() => cy.get(`[test-table-row-index='${index}']
            [test-table-column-action]
            [test-icon-delete]`))
            .click({force: true});
        return this;
    }
}