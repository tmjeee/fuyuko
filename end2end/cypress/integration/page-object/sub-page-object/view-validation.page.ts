import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewValidationEditPopupPage} from "./sub-sub-page-object/view-validation-edit-popup.page";
import {ViewValidationDetailsPage} from "./view-validation-details.page";

export class ViewValidationPage implements ActualPage<ViewValidationPage> {

    validateTitle(): ViewValidationPage {
        cy.get(`[test-page-title]`)
            .should('have.attr', 'test-page-title', 'view-validations');
        return this;
    }

    visit(): ViewValidationPage {
        cy.visit(`/view-gen-layout/(validation//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewValidationPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewValidationPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    clickRunValidation(): ViewValidationEditPopupPage {
        cy.get(`[test-button-run-validation]`).click({force: true});
        return new ViewValidationEditPopupPage();
    }

    expandValidationPanel(validationName: string): ViewValidationPage {
        cy.get(`[test-page-title]`).then((_) => {
            const i = _.find(`[test-panel-content='${validationName}']`).length;
            if (i <= 0) { // not already expanded, click to expand
                cy.get(`[test-panel-header='${validationName}']`)
                    .click({force: true});
            }
        });
        return this;
    }

    collapseValidationPanel(validationName: string): ViewValidationPage {
        cy.get(`[test-page-title]`).then((_) => {
            const i = _.find(`[test-panel-content='${validationName}']`).length;
            if (i > 0) { // already expanded, click to collapse
                cy.get(`[test-panel-header='${validationName}']`)
                    .click({force: true});
            }
        });
        return this;
    }

    clickOnValidationDetails(validationName: string): ViewValidationDetailsPage {
        cy.get(`[test-icon-validation-details='${validationName}']`)
            .click({force: true});
        return new ViewValidationDetailsPage(validationName);
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
}
