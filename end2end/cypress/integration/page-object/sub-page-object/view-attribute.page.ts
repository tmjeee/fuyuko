import {ActualPage} from "../actual.page";
import * as util from "../../util/util";

export class ViewAttributePage implements ActualPage<ViewAttributePage> {

    validateTitle(): ViewAttributePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-attributes');
        return this;
    }

    visit(): ViewAttributePage {
        cy.visit('/view-gen-layout/(attributes//help:view-help)');
        return this;
    }


    verifyErrorMessageExists(): ViewAttributePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewAttributePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

}
