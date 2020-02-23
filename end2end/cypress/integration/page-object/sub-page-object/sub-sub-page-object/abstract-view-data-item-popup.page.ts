

export class AbstractViewDataItemPopupPage {

    verifyPopupTitle(): AbstractViewDataItemPopupPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .should('exist');
        return this;
    }

    editItemName(itemName: string): AbstractViewDataItemPopupPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-field-name]`)
            .clear({force: true})
            .type(`${itemName}`, {force: true});
        return this;
    }

    editItemDescription(itemDescription: string): AbstractViewDataItemPopupPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-field-description]`)
            .clear({force: true})
            .type(itemDescription, {force: true});
        return this;
    }
}
