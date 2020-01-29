import {ActualPage} from "../actual.page";
import * as util from '../../util/util';


export class ImportPage implements ActualPage<ImportPage> {

    visit(): ImportPage {
        cy.visit('/import-export-gen-layout/(import//help:import-help)');
        return this;
    }

    validateTitle(): ImportPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'import');
        return this;
    }

    verifyErrorMessageExists(): ImportPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ImportPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

}
