import {AbstractPage} from "./abstract.page";
import {ActualPage} from "./actual.page";


export class JobsPage extends AbstractPage implements ActualPage<JobsPage> {

    visit(): JobsPage {
        cy.visit('/gen-layout/(jobs//help:jobs-help)');
        return this;
    }

    validateTitle(): JobsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'jobs');
        return this;
    }

}
