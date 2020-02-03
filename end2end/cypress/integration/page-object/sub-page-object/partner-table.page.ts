import {ActualPage} from "../actual.page";
import * as util from '../../util/util';

export class PartnerTablePage implements ActualPage<PartnerTablePage> {

    validateTitle(): PartnerTablePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'partner-table');
        return this;
    }

    visit(): PartnerTablePage {
        cy.visit('/partner-layout/(table//help:partner-help)');
        return this;
    }

    verifyErrorMessageExists(): PartnerTablePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): PartnerTablePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

}
