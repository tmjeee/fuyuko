import {ViewViewPage} from "../view-view.page";


export class ViewViewEditPopupPage {


    verifyPopupTitle(): ViewViewEditPopupPage {
        cy.get(`[test-popup-dialog-title='view-editor-dialog-popup']`)
            .should('exist');
        return this;
    }

    editName(viewName: string) {
        cy.get(`[test-popup-dialog-title='view-editor-dialog-popup']`)
            .find(`[test-field-name]`)
            .clear({force: true})
            .type(`${viewName}`)
        return this;
    }

    editDescription(viewName: string) {
        cy.get(`[test-popup-dialog-title='view-editor-dialog-popup']`)
            .find(`[test-field-description]`)
            .clear({force: true})
            .type(`${viewName}`)
        return this;
    }

    clickOk(): ViewViewPage {
        cy.get(`[test-button-ok]`)
            .click({force: true})
            .wait(100)
        return new ViewViewPage();
    }

    clickCancel(): ViewViewPage {
        cy.get(`[test-button-cancel]`)
            .click({force: true})
            .wait(100)
        return new ViewViewPage();
    }

}

