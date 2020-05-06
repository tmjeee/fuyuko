import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewValidationEditPopupPage} from "./sub-sub-page-object/view-validation-edit-popup.page";
import {ViewValidationDetailsPage} from "./view-validation-details.page";
import {waitUntilTestPageReady} from "../../util/util";

const PAGE_NAME = 'view-validations';
export class ViewValidationPage implements ActualPage<ViewValidationPage> {

    selectGlobalView(viewName: string): ViewValidationPage {
        cy.waitUntil(() => cy.get(`[test-mat-select-global-view]`)).first().click({force: true});
        cy.waitUntil(() => cy.get(`[test-mat-select-option-global-view='${viewName}']`)).click({force: true});
        return this;
    }

    validateTitle(): ViewValidationPage {
        cy.get(`[test-page-title]`)
            .should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    visit(): ViewValidationPage {
        cy.visit(`/view-gen-layout/(validation//help:view-help)`);
        this.waitForReady();
        return this;
    }

    waitForReady(): ViewValidationPage {
        // cy.waitUntil<boolean>(() => cy.get(`[test-page-ready]`).then((n) => n.attr('test-page-ready') == 'true'));
        waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    verifyErrorMessageExists(): ViewValidationPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): ViewValidationPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    clickRunValidation(): ViewValidationEditPopupPage {
        cy.get(`[test-button-run-validation]`).click({force: true});
        return new ViewValidationEditPopupPage();
    }

    expandValidationPanel(validationName: string): ViewValidationPage {
        cy.get(`[test-page-title]`).then((_) => {
            const visible = _.find(`[test-panel-content='${validationName}']`).is(':visible');
            if (!visible) { // not already expanded, click to expand
                return cy.get(`[test-panel-header='${validationName}']`)
                    .click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    collapseValidationPanel(validationName: string): ViewValidationPage {
        cy.get(`[test-page-title]`).then((_) => {
            const visible = _.find(`[test-panel-content='${validationName}']`).is(':visible');
            if (visible) { // already expanded, click to collapse
                return cy.get(`[test-panel-header='${validationName}']`)
                    .click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    clickOnValidationDetails(validationName: string): ViewValidationDetailsPage {
        cy.get(`[test-link-validation-details='${validationName}']`)
             .click({force: true});
        // cy.wait(2000);
        return new ViewValidationDetailsPage(validationName).waitForReady();
    }

    verifyValidationPanelExpanded(validationName: string): ViewValidationPage {
        cy.get(`[test-panel-content='${validationName}']`)
            .should('be.visible');
        return this;
    }

    verifyValidationPanelCollapsed(validationName: string) {
        cy.get(`[test-panel-content='${validationName}']`)
            .should('not.be.visible');
        return this;
    }

    clickReload(): ViewValidationPage {
        cy.get(`[test-button-reload-validation]`).click({force: true});
        cy.wait(1000);
        return this;
    }

    clickDelete(validationName: string) {
        this.expandValidationPanel(validationName);
        cy.get(`[test-panel-content='${validationName}']`)
            .find(`[test-icon-delete-validation='${validationName}']`)
            .click({force: true});
        return this;
    }
}
