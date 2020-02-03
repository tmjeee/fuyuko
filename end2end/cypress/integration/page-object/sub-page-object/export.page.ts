import {ActualPage} from "../actual.page";
import * as util from '../../util/util';


export class ExportPage implements ActualPage<ExportPage> {

    visit(): ExportPage {
        cy.visit('/import-export-gen-layout/(export//help:import-help)');
        return this;
    }

    validateTitle(): ExportPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'export');
        return this;
    }

    verifyErrorMessageExists(): ExportPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ExportPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }


}
