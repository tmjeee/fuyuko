import {AbstractPage} from "../abstract.page";
import {ActualPage} from "../actual.page";

export class ViewAttributeDetailsPage extends AbstractPage implements ActualPage<ViewAttributeDetailsPage> {

    constructor(private attributeId: number) {
        super();
    }

    validateTitle(): ViewAttributeDetailsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-edit-attribute');
        return this;
    }

    visit(): ViewAttributeDetailsPage {
        cy.visit(`/view-gen-layout/(attribute/${this.attributeId}//help:view-help)`);
        return this;
    }

}
