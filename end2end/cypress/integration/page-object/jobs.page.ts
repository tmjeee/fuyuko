import {ActualPage} from "./actual.page";
import * as util from '../util/util';


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

    verifyErrorMessageExists(): JobsPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): JobsPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

}
