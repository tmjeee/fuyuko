import {ActualPage} from "../actual.page";
import * as util from "../../util/util";

export class ViewDataListPage implements ActualPage<ViewDataListPage> {

    validateTitle(): ViewDataListPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-data-list');
        return this;
    }

    visit(): ViewDataListPage {
        cy.visit(`/view-gen-layout/(data-list//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewDataListPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewDataListPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }
}
