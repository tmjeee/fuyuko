import {ActualPage} from "../actual.page";
import * as util from "../../util/util";


export class CustomExportPage implements ActualPage<CustomExportPage> {

    validateTitle(): CustomExportPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'custom-export');
        return this;
    }

    verifyErrorMessageExists(): CustomExportPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): CustomExportPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    visit(): CustomExportPage {
        cy.visit(`/import-export-gen-layout/(custom-export//help:export-help)`);
        return this;
    }

}