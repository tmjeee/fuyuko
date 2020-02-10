import {AbstractViewAttributePage} from "./abstract-view-attribute.page";


export class ViewAttributeEditPage extends AbstractViewAttributePage {

    verifyTitle(): ViewAttributeEditPage {
        cy.get(`[test-page-title='view-edit-attribute']`)
            .should('exist');
        return this;
    }
}