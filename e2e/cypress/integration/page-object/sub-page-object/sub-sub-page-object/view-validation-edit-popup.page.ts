import {ViewValidationPage} from "../view-validation.page";


export class ViewValidationEditPopupPage {


    verifyPopupTitle(): this {
        cy.get(`[test-popup-dialog-title='validation-creation-dialog-popup']`)
            .should('exist');
        return this;
    }

    editName(name: string): ViewValidationEditPopupPage {
        cy.get(`[test-popup-dialog-title='validation-creation-dialog-popup']`)
            .find(`[test-field-validation-name]`)
            .clear({force: true})
            .type(`${name}`, {force: true})
        return this;
    }

    editDescription(description: string): ViewValidationEditPopupPage {
        cy.get(`[test-popup-dialog-title='validation-creation-dialog-popup']`)
            .find(`[test-field-validation-description]`)
            .clear({force: true})
            .type(`${description}`, {force: true})
        return this;
    }

    clickOk(): ViewValidationPage {
        cy.get(`[test-popup-dialog-title='validation-creation-dialog-popup']`)
            .find(`[test-button-ok]`)
            .click({force: true});
        return new ViewValidationPage();
    }

    clickCancel(): ViewValidationPage {
        cy.get(`[test-popup-dialog-title='validation-creation-dialog-popup']`)
            .find(`[test-button-cancel]`)
            .click({force: true});
        return new ViewValidationPage();
    }
}
