
import {ActualPage} from "../actual.page";
import * as util from "../../util/util";

export class ViewViewPage implements ActualPage<ViewViewPage> {

    validateTitle(): ViewViewPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-views');
        return this;
    }

    visit(): ViewViewPage {
        cy.visit(`/view-gen-layout/(view//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewViewPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewViewPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }
}
