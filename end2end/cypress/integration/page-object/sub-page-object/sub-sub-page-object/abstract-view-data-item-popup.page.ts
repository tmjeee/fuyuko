import * as util from "../../../util/util";


export class AbstractViewDataItemPopupPage {

    constructor(public  PAGE_NAME: string) {
    }

    waitForReady(): AbstractViewDataItemPopupPage {
        util.waitUntilTestPageReady(this.PAGE_NAME);
        return this;
    }

    waitForPopupReady(): this {
        util.waitUntilPopupReady(`item-editor-dialog-popup`);
        return this;
    }

    waitForPopupGone(): AbstractViewDataItemPopupPage {
        util.waitUntilPopupGone('item-editor-dialog-popup');
        return this;
    }

    verifyPopupTitle(): this {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .should('exist');
        this.waitForReady();
        return this;
    }

    editItemName(itemName: string): this {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']
                                   [test-field-name]`)
            .clear({force: true})
            .type(`${itemName}`, {force: true});
        return this;
    }

    editItemDescription(itemDescription: string): this {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']
                                   [test-field-description]`)
            .clear({force: true})
            .type(itemDescription, {force: true});
        return this;
    }
}
