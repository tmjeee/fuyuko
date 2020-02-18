import {ViewDataThumbnailPage} from "../view-data-thumbnail.page";


export class ViewDataThumbnailItemPopupPage {
    verifyPopupTitle(): ViewDataThumbnailItemPopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`).should('exist');
        return this;
    }

    editItemName(itemName: string): ViewDataThumbnailItemPopupPage {
        cy.get(`[test-field-name]`).clear({force: true}).type(`${itemName}`, {force: true});
        return this;
    }

    editItemDescription(itemDescription: string): ViewDataThumbnailItemPopupPage {
        cy.get(`[test-field-description]`).clear({force: true}).type(itemDescription, {force: true});
        return this;
    }

    clickOk(): ViewDataThumbnailPage {
        cy.get(`[test-button-popup-ok]`).click({force: true});
        return new ViewDataThumbnailPage();
    }

    clickCancel(): ViewDataThumbnailPage {
        cy.get(`[test-button-popup-cancel]`).click({force: true});
        return new ViewDataThumbnailPage();
    }
}
