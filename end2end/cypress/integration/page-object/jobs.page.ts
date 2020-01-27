import {ActualPage} from "./actual.page";


export class JobsPage implements ActualPage<JobsPage> {

    constructor() { }

    visit(): JobsPage {
        cy.visit('/gen-layout/(jobs//help:jobs-help)');
        return this;
    }

    validateTitle(): JobsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'jobs');
        return this;
    }

}
