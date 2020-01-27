
import {ActualPage} from "../actual.page";

export class ViewViewPage implements ActualPage<ViewViewPage> {

    validateTitle(): ViewViewPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-views');
        return this;
    }

    visit(): ViewViewPage {
        cy.visit(`/view-gen-layout/(view//help:view-help)`);
        return this;
    }

}
