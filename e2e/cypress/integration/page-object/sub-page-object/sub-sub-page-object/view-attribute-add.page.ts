import {AbstractViewAttributePage} from "./abstract-view-attribute.page";

export class ViewAttributeAddPage extends AbstractViewAttributePage {

    verifyTitle(): ViewAttributeAddPage {
        cy.get(`[test-page-title='view-add-attribute']`)
            .should('exist');
        return this;
    }

}
