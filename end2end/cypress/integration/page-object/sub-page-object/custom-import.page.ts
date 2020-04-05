import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ExportPageStep1} from "./export.page";


export class CustomImportPage implements ActualPage<CustomImportPage> {

    validateTitle(): CustomImportPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'custom-import');
        return this;
    }

    verifyErrorMessageExists(): CustomImportPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): CustomImportPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    visit(): CustomImportPage {
        cy.visit(`/import-export-gen-layout/(custom-import//help:import-help)`);
        return this;
    }


    clickStep1(): CustomImportPageStep1 {
        cy.get(`mat-step-header[aria-posinset='1']`).click({force: true});
        return new CustomImportPageStep1();
    }
}

export class CustomImportPageStep1 {

    verifyInStep(): CustomImportPageStep1 {
        cy.get(`mat-step-header[aria-posinset='1'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }
}