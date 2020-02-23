import {ViewDataThumbnailPage} from "../view-data-thumbnail.page";
import {ViewDataThumbnailEditPopupPage} from "./view-data-thumbnail-edit-popup.page";


export class ViewDataThumbnailItemPopupPage {
    verifyPopupTitle(): ViewDataThumbnailItemPopupPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .should('exist');
        return this;
    }

    editItemName(itemName: string): ViewDataThumbnailItemPopupPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-field-name]`).clear({force: true}).type(`${itemName}`, {force: true});
        return this;
    }

    editItemDescription(itemDescription: string): ViewDataThumbnailItemPopupPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-field-description]`).clear({force: true}).type(itemDescription, {force: true});
        return this;
    }

    clickOk(): ViewDataThumbnailPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-button-item-editor-popup-ok]`).click({force: true});
        return new ViewDataThumbnailPage();
    }

    clickCancel(): ViewDataThumbnailPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-button-item-editor-popup-cancel]`).click({force: true});
        return new ViewDataThumbnailPage();
    }


    clickCancel2(): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-button-item-editor-popup-cancel]`).click({force: true});
        return new ViewDataThumbnailEditPopupPage();
    }


    clickOk2(): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-button-item-editor-popup-ok]`).click({force: true});
        return new ViewDataThumbnailEditPopupPage();
    }
}
