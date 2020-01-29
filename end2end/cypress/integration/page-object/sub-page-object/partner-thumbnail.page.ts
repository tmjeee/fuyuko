import {ActualPage} from "../actual.page";
import * as util from '../../util/util';

export class PartnerThubnailPage implements ActualPage<PartnerThubnailPage> {

    validateTitle(): PartnerThubnailPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'partner-thumbnail');
        return this;
    }

    visit(): PartnerThubnailPage {
        cy.visit('/partner-layout/(thumbnail//help:partner-help)');
        return this;
    }

    verifyErrorMessageExists(): PartnerThubnailPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): PartnerThubnailPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }
}
