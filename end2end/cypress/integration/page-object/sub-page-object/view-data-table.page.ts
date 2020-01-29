import {ActualPage} from "../actual.page";
import * as util from "../../util/util";

export class ViewDataTablePage implements ActualPage<ViewDataTablePage> {

    validateTitle(): ViewDataTablePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-data-table');
        return this;
    }

    visit(): ViewDataTablePage {
        cy.visit(`/view-gen-layout/(data-tabular//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewDataTablePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewDataTablePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }
}
