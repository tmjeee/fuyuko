

export class ViewDataThumbnailAttributePopupPage {
    verifyPopupTitle(): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`).should('exist');
        return this;
    }
}
