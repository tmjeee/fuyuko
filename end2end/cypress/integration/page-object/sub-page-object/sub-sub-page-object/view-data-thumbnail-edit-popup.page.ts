

export class ViewDataThumbnailEditPopupPage {
    verifyPopupTitle(): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-popup']`).should('exist');
        return this;
    }
}
