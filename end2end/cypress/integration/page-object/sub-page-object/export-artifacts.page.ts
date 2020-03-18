import * as util from "../../util/util";


export class ExportArtifactsPage {

    visit(): ExportArtifactsPage {
        cy.visit('/import-export-gen-layout/(export-artifacts//help:import-help)');
        return this;
    }

    validateTitle(): ExportArtifactsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'export-artifacts');
        return this;
    }

    verifyErrorMessageExists(): ExportArtifactsPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ExportArtifactsPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

}