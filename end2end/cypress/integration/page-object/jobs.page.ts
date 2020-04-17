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

    verifyJobName(index: number, jobName: string): JobsPage {
        cy.get(`[test-job-header-index='${index}']`)
            .find(`[test-job-title-index='${index}']`)
            .should('contain.text', jobName);
        return this;
    }

    expandPanel(index: number): JobsPage {
        cy.get(`[test-page-title]`).then((_) => {
            const length = _.find(`[test-job-header-index='${index}].mat-expanded`).length;
            if (length < 0) { // not already expanded
                return cy.get(`[test-page-title]`)
                    .find(`[test-job-header-index='${index}]`)
                    .find(`[test-job-title-index='${index}']`)
                    .click({force: true});
            }
        });
        return this;
    }

}
